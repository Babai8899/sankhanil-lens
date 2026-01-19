import express from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import sharp from 'sharp';
import Image from '../models/Image.js';
import ContactMessage from '../models/ContactMessage.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit (for high-res mobile photos)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   GET /api/admin/images/:id/preview
// @desc    Get image preview thumbnail (for admin dashboard)
// @access  Private
router.get('/images/:id/preview', authMiddleware, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get image from GridFS
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'images' });
    const downloadStream = bucket.openDownloadStream(image.fileId);
    
    const chunks = [];
    
    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        
        // Create thumbnail
        const thumbnail = await sharp(buffer)
          .resize(400, 300, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toBuffer();

        res.set({
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'private, max-age=3600'
        });

        res.send(thumbnail);
      } catch (processingError) {
        console.error('Thumbnail processing error:', processingError);
        res.status(500).json({ error: 'Error processing thumbnail' });
      }
    });

    downloadStream.on('error', (error) => {
      console.error('Download stream error:', error);
      res.status(404).json({ error: 'Image file not found' });
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Error generating preview' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalImages = await Image.countDocuments();
    const streetImages = await Image.countDocuments({ category: 'street' });
    const natureImages = await Image.countDocuments({ category: 'nature' });
    const unreadMessages = await ContactMessage.countDocuments({ read: false });
    const totalMessages = await ContactMessage.countDocuments();
    
    // Total views across all images
    const viewsResult = await Image.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    // Recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = await Image.countDocuments({
      uploadedAt: { $gte: sevenDaysAgo }
    });

    // Views by category
    const viewsByCategory = await Image.aggregate([
      {
        $group: {
          _id: '$category',
          totalViews: { $sum: '$views' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly upload trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyUploads = await Image.aggregate([
      {
        $match: { uploadedAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$uploadedAt' },
            month: { $month: '$uploadedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top viewed images
    const topImages = await Image.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title category views location year');

    res.json({
      totalImages,
      streetImages,
      natureImages,
      unreadMessages,
      totalMessages,
      totalViews,
      recentUploads,
      viewsByCategory,
      monthlyUploads,
      topImages
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

// @route   POST /api/admin/images
// @desc    Upload new image
// @access  Private
router.post('/images', authMiddleware, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 25MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { title, category, location, year, description, displaySection } = req.body;

    // Validate required fields
    if (!title || !category || !location || !year || !displaySection) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process image with sharp (resize and optimize)
    const processedImage = await sharp(req.file.buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Create GridFS bucket
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    // Generate unique filename
    const filename = `${Date.now()}-${req.file.originalname}`;

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
        uploadedBy: req.admin.username
      }
    });

    uploadStream.end(processedImage);

    uploadStream.on('finish', async () => {
      // Create image document
      const image = new Image({
        filename,
        originalName: req.file.originalname,
        title,
        category: category.toLowerCase(),
        location,
        year: parseInt(year),
        description: description || '',
        displaySection: displaySection.toLowerCase(),
        fileId: uploadStream.id,
        contentType: req.file.mimetype,
        size: processedImage.length
      });

      await image.save();

      res.status(201).json({
        message: 'Image uploaded successfully',
        image: {
          id: image._id,
          title: image.title,
          category: image.category,
          location: image.location,
          year: image.year,
          displaySection: image.displaySection
        }
      });
    });

    uploadStream.on('error', (error) => {
      console.error('Upload stream error:', error);
      res.status(500).json({ error: 'Error uploading image' });
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// @route   GET /api/admin/images
// @desc    Get all images with pagination
// @access  Private
router.get('/images', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const displaySection = req.query.displaySection;
    const search = req.query.search;

    const query = {};
    if (category) query.category = category.toLowerCase();
    if (displaySection) query.displaySection = displaySection.toLowerCase();
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const totalImages = await Image.countDocuments(query);
    const images = await Image.find(query)
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-fileId');

    res.json({
      images,
      currentPage: page,
      totalPages: Math.ceil(totalImages / limit),
      totalImages
    });
  } catch (error) {
    console.error('Fetch images error:', error);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// @route   PUT /api/admin/images/:id
// @desc    Update image details
// @access  Private
router.put('/images/:id', authMiddleware, async (req, res) => {
  try {
    const { title, category, location, year, description, displaySection } = req.body;

    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (title) image.title = title;
    if (category) image.category = category.toLowerCase();
    if (location) image.location = location;
    if (year) image.year = parseInt(year);
    if (description !== undefined) image.description = description;
    if (displaySection) image.displaySection = displaySection.toLowerCase();

    await image.save();

    res.json({
      message: 'Image updated successfully',
      image
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ error: 'Error updating image' });
  }
});

// @route   DELETE /api/admin/images/:id
// @desc    Delete image
// @access  Private
router.delete('/images/:id', authMiddleware, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from GridFS
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'images' });
    
    try {
      await bucket.delete(image.fileId);
    } catch (gridError) {
      console.error('GridFS delete error:', gridError);
    }

    // Delete image document
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Error deleting image' });
  }
});

// @route   GET /api/admin/messages
// @desc    Get all contact messages
// @access  Private
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    const query = unreadOnly ? { read: false } : {};

    const totalMessages = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages
    });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// @route   PUT /api/admin/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/messages/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Error updating message' });
  }
});

// @route   PUT /api/admin/messages/:id/replied
// @desc    Mark message as replied
// @access  Private
router.put('/messages/:id/replied', authMiddleware, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { replied: true, read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message marked as replied', data: message });
  } catch (error) {
    console.error('Mark replied error:', error);
    res.status(500).json({ error: 'Error updating message' });
  }
});

// @route   DELETE /api/admin/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/messages/:id', authMiddleware, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Error deleting message' });
  }
});

export default router;
