const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { analyzeText } = require('../services/nlpService');
const logger = require('../utils/logger');

// Get all conversations with pagination and filtering
router.get('/conversations', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      searchText,
    } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (searchText) {
      query.text = { $regex: searchText, $options: 'i' };
    }

    const conversations = await Conversation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Conversation.countDocuments(query);

    res.json({
      conversations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalItems: count,
    });
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Get a single conversation by ID
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Error fetching conversation' });
  }
});

// Create a new conversation with analysis
router.post('/conversations', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const analysis = await analyzeText(text);
    const conversation = new Conversation({
      text,
      ...analysis,
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    logger.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Error creating conversation' });
  }
});

// Delete a conversation
router.delete('/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    logger.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Error deleting conversation' });
  }
});

// Get conversation statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalCount = await Conversation.countDocuments();
    const averageSentiment = await Conversation.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: '$sentiment.score' },
        },
      },
    ]);

    const emotionAverages = await Conversation.aggregate([
      {
        $group: {
          _id: null,
          joy: { $avg: '$emotions.joy' },
          sadness: { $avg: '$emotions.sadness' },
          anger: { $avg: '$emotions.anger' },
          fear: { $avg: '$emotions.fear' },
          surprise: { $avg: '$emotions.surprise' },
        },
      },
    ]);

    res.json({
      totalConversations: totalCount,
      averageSentiment: averageSentiment[0]?.average || 0,
      emotionAverages: emotionAverages[0] || {},
    });
  } catch (error) {
    logger.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router; 