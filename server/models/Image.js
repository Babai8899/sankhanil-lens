import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['street', 'nature'],
    required: true,
  },
  displaySection: {
    type: String,
    enum: ['home', 'gallery', 'all'],
    default: 'all',
  },
  location: String,
  year: String,
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
imageSchema.index({ category: 1, uploadedAt: -1 });
imageSchema.index({ displaySection: 1, category: 1 });

const Image = mongoose.model('Image', imageSchema);

export default Image;
