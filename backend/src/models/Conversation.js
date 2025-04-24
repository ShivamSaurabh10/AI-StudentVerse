const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sentiment: {
    score: Number,
    comparative: Number,
    positive: [String],
    negative: [String],
  },
  emotions: {
    joy: Number,
    sadness: Number,
    anger: Number,
    fear: Number,
    surprise: Number,
  },
  context: {
    formality: {
      type: String,
      enum: ['formal', 'informal'],
    },
    topic: {
      type: String,
      default: 'general',
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
  },
  language: {
    type: String,
    default: 'en',
  },
  entities: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation; 