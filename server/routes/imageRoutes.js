import express from 'express';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import Image from '../models/Image.js';
import { verifyImageToken, generateImageToken } from '../middleware/imageAuth.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

let gfs;

mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'images'
  });
  console.log('✅ GridFS initialized');
});

// Upload image endpoint (for admin use)
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { title, category, location, year } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    // Generate unique filename
    const filename = `${crypto.randomBytes(16).toString('hex')}-${Date.now()}${req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))}`;

    // Create upload stream to GridFS
    const uploadStream = gfs.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
        title,
        category,
      }
    });

    // Write file to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      // Save metadata to MongoDB
      const imageDoc = new Image({
        filename,
        originalName: req.file.originalname,
        title,
        category: category.toLowerCase(),
        location,
        year,
        fileId: uploadStream.id,
        contentType: req.file.mimetype,
        size: req.file.size,
      });

      await imageDoc.save();

      res.status(201).json({
        message: 'Image uploaded successfully',
        image: imageDoc,
      });
    });

    uploadStream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Error uploading image' });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Get all images metadata
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category: category.toLowerCase() } : {};
    
    const images = await Image.find(filter)
      .select('-fileId') // Don't expose internal GridFS ID
      .sort({ uploadedAt: -1 });

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// Get home page images (NATURE_01, NATURE_02, STREET_01, STREET_02)
router.get('/home', async (req, res) => {
  try {
    const images = await Image.find({ displaySection: 'home' })
      .select('-fileId')
      .sort({ category: 1, originalName: 1 });

    res.json(images);
  } catch (error) {
    console.error('Error fetching home images:', error);
    res.status(500).json({ error: 'Error fetching home images' });
  }
});

// Get gallery images (03 to 07 for each category)
router.get('/gallery', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { displaySection: 'gallery' };
    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }
    
    const images = await Image.find(filter)
      .select('-fileId')
      .sort({ category: 1, originalName: 1 });

    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Error fetching gallery images' });
  }
});

// Get single image metadata
router.get('/meta/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).select('-fileId');
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    console.error('Error fetching image metadata:', error);
    res.status(500).json({ error: 'Error fetching image metadata' });
  }
});

// Generate token for image access
router.get('/token/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const token = generateImageToken(req.params.id);
    res.json({ token, expiresIn: 60000 }); // 60 seconds
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Error generating token' });
  }
});

// Serve watermarked image - Protected with token and referer check
router.get('/view/:id', verifyImageToken, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Increment view count
    image.views += 1;
    await image.save();

    // Get image from GridFS
    const downloadStream = gfs.openDownloadStream(image.fileId);
    
    const chunks = [];
    
    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        
        // Check if watermark is requested (for save/download attempts)
        const applyWatermark = req.query.watermark === 'true';
        const quality = 85; // High quality by default
        
        // Process image with sharp
        let processedImage = sharp(buffer);
        
        // Get image metadata
        const metadata = await processedImage.metadata();
        
        // Don't resize - keep original dimensions for better quality
        // Only resize if explicitly requested for thumbnails
        if (req.query.thumbnail === 'true') {
          processedImage = processedImage.resize(400, null, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
        
        // Apply watermark only if requested
        if (applyWatermark) {
          const resizedMetadata = await processedImage.metadata();
          const finalWidth = resizedMetadata.width;
          const finalHeight = resizedMetadata.height;
          
          // Create watermark text as SVG
          const watermarkText = 'SANKHANIL';
          const fontSize = Math.max(finalWidth / 15, 40);
          
          // Create a prominent watermark overlay
          const svgWatermark = `
            <svg width="${finalWidth}" height="${finalHeight}">
              <defs>
                <pattern id="watermark-pattern" patternUnits="userSpaceOnUse" width="${fontSize * 10}" height="${fontSize * 5}" patternTransform="rotate(-30)">
                  <text x="0" y="${fontSize}" font-family="Arial" font-size="${fontSize}" font-weight="bold" fill="rgba(255,255,255,0.5)" stroke="rgba(0,0,0,0.3)" stroke-width="2">
                    ${watermarkText}
                  </text>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#watermark-pattern)"/>
            </svg>
          `;
          
          // Composite watermark onto image
          processedImage = processedImage.composite([{
            input: Buffer.from(svgWatermark),
            gravity: 'center'
          }]);
        }
        
        // Convert to JPEG with high quality
        const outputBuffer = await processedImage
          .jpeg({ quality, progressive: true })
          .toBuffer();

        // Set headers to prevent caching and downloading
        res.set({
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
          'Content-Disposition': 'inline', // Force inline display, not download
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN'
        });

        res.send(outputBuffer);
      } catch (processingError) {
        console.error('Image processing error:', processingError);
        res.status(500).json({ error: 'Error processing image' });
      }
    });

    downloadStream.on('error', (error) => {
      console.error('Download stream error:', error);
      res.status(404).json({ error: 'Image file not found in storage' });
    });

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Error serving image' });
  }
});

// Delete image (admin only - add authentication middleware in production)
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from GridFS
    await gfs.delete(image.fileId);
    
    // Delete metadata from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Error deleting image' });
  }
});

export default router;
