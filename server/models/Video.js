const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true,
    default: 'https://via.placeholder.com/400x225?text=Video+Thumbnail'
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  category: {
    type: String,
    enum: ['Movies', 'TV Shows', 'Documentaries', 'Kids', 'Sports'],
    required: true
  },
  tags: [String],

  // Access Control - Which tiers can watch this
  accessTier: {
    type: String,
    enum: ['basic', 'premium', 'pro'],
    required: true
  },

  // Quality options based on tier
  qualities: [{
    label: {
      type: String,
      enum: ['360p', '480p', '720p', '1080p', '4K']
    },
    url: String,
    requiredTier: {
      type: String,
      enum: ['basic', 'premium', 'pro']
    }
  }],

  // Metadata
  releaseYear: Number,
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },

  // Featured flags
  isTrending: {
    type: Boolean,
    default: false
  },
  isPremiere: {
    type: Boolean,
    default: false
  },
  isExclusive: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Video', videoSchema);
