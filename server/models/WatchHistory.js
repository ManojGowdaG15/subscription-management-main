const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  progress: {
    type: Number, // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  watchDuration: {
    type: Number, // total seconds watched
    default: 0
  },
  lastPosition: {
    type: Number, // last playback position
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one history entry per user per video
watchHistorySchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
