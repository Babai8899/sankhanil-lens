import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Image from '../models/Image.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image data mapping for migration
const imageData = {
  // Street Photography - Home (01-02)
  'STREET_01.JPG': { title: 'Urban Moments', category: 'street', location: 'City Streets', year: '2023', displaySection: 'home' },
  'STREET_02.JPG': { title: 'Street Life', category: 'street', location: 'Downtown', year: '2023', displaySection: 'home' },
  
  // Street Photography - Gallery (03-07)
  'STREET_03.jpg': { title: 'Urban Life', category: 'street', location: 'City Streets', year: '2023', displaySection: 'gallery' },
  'STREET_04.JPG': { title: 'City Vibes', category: 'street', location: 'Downtown', year: '2023', displaySection: 'gallery' },
  'STREET_05.JPG': { title: 'Street Stories', category: 'street', location: 'City Center', year: '2023', displaySection: 'gallery' },
  'STREET_06.JPG': { title: 'Urban Tales', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'gallery' },
  'STREET_07.JPG': { title: 'Street Life', category: 'street', location: 'Downtown District', year: '2023', displaySection: 'gallery' },
  
  // Street Photography - All (08+)
  'STREET_08.JPG': { title: 'City Rhythm', category: 'street', location: 'Urban Area', year: '2023', displaySection: 'all' },
  'STREET_09.JPG': { title: 'Metropolitan', category: 'street', location: 'City Center', year: '2023', displaySection: 'all' },
  'STREET_10.JPG': { title: 'Urban Canvas', category: 'street', location: 'Downtown', year: '2023', displaySection: 'all' },
  'STREET_11.JPG': { title: 'Street Scene', category: 'street', location: 'City Streets', year: '2023', displaySection: 'all' },
  'STREET_12.JPG': { title: 'City Lights', category: 'street', location: 'Urban District', year: '2023', displaySection: 'all' },
  'STREET_13.JPG': { title: 'Urban Story', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'all' },
  'STREET_14.JPG': { title: 'Street Culture', category: 'street', location: 'City Center', year: '2023', displaySection: 'all' },
  'STREET_15.JPG': { title: 'City Soul', category: 'street', location: 'Downtown', year: '2023', displaySection: 'all' },
  'STREET_16.JPG': { title: 'Urban Energy', category: 'street', location: 'City Streets', year: '2023', displaySection: 'all' },
  'STREET_17.JPG': { title: 'Street Vista', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'all' },
  'STREET_18.JPG': { title: 'City Pulse', category: 'street', location: 'Urban Area', year: '2023', displaySection: 'all' },
  'STREET_19.JPG': { title: 'Urban Scene', category: 'street', location: 'Downtown', year: '2023', displaySection: 'all' },
  'STREET_20.jpg': { title: 'Street Life', category: 'street', location: 'City Center', year: '2023', displaySection: 'all' },
  'STREET_21.JPG': { title: 'City Beat', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'all' },
  'STREET_22.JPG': { title: 'Urban Motion', category: 'street', location: 'City Streets', year: '2023', displaySection: 'all' },
  'STREET_23.JPG': { title: 'Street Flow', category: 'street', location: 'Downtown', year: '2023', displaySection: 'all' },
  'STREET_24.jpg': { title: 'City Dreams', category: 'street', location: 'Urban District', year: '2023', displaySection: 'all' },
  'STREET_25.JPG': { title: 'Urban Life', category: 'street', location: 'City Center', year: '2023', displaySection: 'all' },
  'STREET_26.jpg': { title: 'Street Vibes', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'all' },
  'STREET_27.JPG': { title: 'City Walk', category: 'street', location: 'Downtown', year: '2023', displaySection: 'all' },
  'STREET_28.jpg': { title: 'Urban Journey', category: 'street', location: 'City Streets', year: '2023', displaySection: 'all' },
  'STREET_29.JPG': { title: 'Street Art', category: 'street', location: 'Urban Area', year: '2023', displaySection: 'all' },
  'STREET_30.jpg': { title: 'City Life', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'all' },
  'STREET_31.jpg': { title: 'Urban View', category: 'street', location: 'Downtown', year: '2023', displaySection: 'all' },
  'STREET_32.jpg': { title: 'Street Poetry', category: 'street', location: 'City Center', year: '2023', displaySection: 'all' },
  'STREET_33.JPG': { title: 'City Stories', category: 'street', location: 'Urban District', year: '2023', displaySection: 'all' },
  'STREET_34.JPG': { title: 'Urban Chronicles', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'all' },
  'STREET_35.JPG': { title: 'Street Moments', category: 'street', location: 'City Streets', year: '2023', displaySection: 'all' },
  'STREET_36.jpg': { title: 'CityScape', category: 'street', location: 'Downtown', year: '2023', displaySection: 'all' },
  'STREET_37.JPG': { title: 'Urban Tales', category: 'street', location: 'City Center', year: '2023', displaySection: 'all' },
  'STREET_38.jpg': { title: 'Street Symphony', category: 'street', location: 'Metropolitan', year: '2023', displaySection: 'all' },
  
  // Nature Photography - Home (01-02)
  'NATURE_01.jpg': { title: 'Peaceful Sunset', category: 'nature', location: 'Mountains', year: '2023', displaySection: 'home' },
  'NATURE_02.jpg': { title: 'Golden Hour', category: 'nature', location: 'Countryside', year: '2023', displaySection: 'home' },
  
  // Nature Photography - Gallery (03-07)
  'NATURE_03.jpg': { title: 'Serene Landscape', category: 'nature', location: 'Valley', year: '2023', displaySection: 'gallery' },
  'NATURE_04.JPG': { title: 'Natural Beauty', category: 'nature', location: 'Forest', year: '2023', displaySection: 'gallery' },
  'NATURE_05.JPG': { title: 'Wild Horizon', category: 'nature', location: 'Plains', year: '2023', displaySection: 'gallery' },
  'NATURE_06.JPG': { title: 'Green Paradise', category: 'nature', location: 'Hills', year: '2023', displaySection: 'gallery' },
  'NATURE_07.JPG': { title: 'Mountain Vista', category: 'nature', location: 'Highlands', year: '2023', displaySection: 'gallery' },
  
  // Nature Photography - All (08+)
  'NATURE_08.JPG': { title: 'Nature\'s Canvas', category: 'nature', location: 'Wilderness', year: '2023', displaySection: 'all' },
  'NATURE_09.JPG': { title: 'Tranquil Scene', category: 'nature', location: 'Lake', year: '2023', displaySection: 'all' },
  'NATURE_10.JPG': { title: 'Natural Wonder', category: 'nature', location: 'Valley', year: '2023', displaySection: 'all' },
  'NATURE_11.jpg': { title: 'Scenic Beauty', category: 'nature', location: 'Mountains', year: '2023', displaySection: 'all' },
  'NATURE_12.jpg': { title: 'Wild Beauty', category: 'nature', location: 'Forest', year: '2023', displaySection: 'all' },
  'NATURE_13.JPG': { title: 'Nature\'s Glory', category: 'nature', location: 'Countryside', year: '2023', displaySection: 'all' },
  'NATURE_14.jpg': { title: 'Peaceful Vista', category: 'nature', location: 'Hills', year: '2023', displaySection: 'all' },
  'NATURE_15.jpg': { title: 'Natural Majesty', category: 'nature', location: 'Wilderness', year: '2023', displaySection: 'all' },
};

async function migrateImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sankhanil-lens', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const gfs = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    });

    // Path to assets folder
    const assetsPath = path.join(__dirname, '../../src/assets');
    
    // Get all image files
    const files = fs.readdirSync(assetsPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(file) && 
      imageData[file] // Only process files we have metadata for
    );

    console.log(`\n📁 Found ${imageFiles.length} images to migrate\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const filename of imageFiles) {
      try {
        // Check if already migrated
        const existing = await Image.findOne({ originalName: filename });
        if (existing) {
          console.log(`⏭️  Skipping ${filename} (already migrated)`);
          continue;
        }

        const filePath = path.join(assetsPath, filename);
        const fileBuffer = fs.readFileSync(filePath);
        const stats = fs.statSync(filePath);
        
        const metadata = imageData[filename];
        const newFilename = `${Date.now()}-${filename}`;

        // Upload to GridFS
        const uploadStream = gfs.openUploadStream(newFilename, {
          contentType: `image/${path.extname(filename).slice(1).toLowerCase()}`,
          metadata: {
            originalName: filename,
            title: metadata.title,
            category: metadata.category,
          }
        });

        uploadStream.end(fileBuffer);

        await new Promise((resolve, reject) => {
          uploadStream.on('finish', async () => {
            try {
              // Save metadata to MongoDB
              const imageDoc = new Image({
                filename: newFilename,
                originalName: filename,
                title: metadata.title,
                category: metadata.category,
                displaySection: metadata.displaySection,
                location: metadata.location,
                year: metadata.year,
                fileId: uploadStream.id,
                contentType: `image/${path.extname(filename).slice(1).toLowerCase()}`,
                size: stats.size,
              });

              await imageDoc.save();
              console.log(`✅ Migrated: ${filename} -> ${metadata.title}`);
              successCount++;
              resolve();
            } catch (err) {
              console.error(`❌ Error saving metadata for ${filename}:`, err.message);
              errorCount++;
              reject(err);
            }
          });

          uploadStream.on('error', (err) => {
            console.error(`❌ Error uploading ${filename}:`, err.message);
            errorCount++;
            reject(err);
          });
        });

      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateImages();
