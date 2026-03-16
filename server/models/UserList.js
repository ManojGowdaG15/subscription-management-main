const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My List'
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  type: {
    type: String,
    enum: ['watchlist', 'favorites', 'custom'],
    default: 'watchlist'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserList', userListSchema);
