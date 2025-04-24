const natural = require('natural');
const Sentiment = require('sentiment');
const logger = require('../utils/logger');

// Initialize tools
const tokenizer = new natural.WordTokenizer();
const sentiment = new Sentiment();

/**
 * Analyze text for sentiment, key entities, and overall metrics
 * @param {string} text - The text to analyze
 * @returns {Object} Analysis results
 */
const analyzeText = async (text) => {
  try {
    logger.info('Starting text analysis');
    
    // Basic text metrics
    const tokens = tokenizer.tokenize(text);
    const wordCount = tokens.length;
    
    // Sentiment analysis
    const sentimentResult = sentiment.analyze(text);
    
    // Language processing
    const language = detectLanguage(text);
    
    // Emotion analysis
    const emotions = analyzeEmotions(text);
    
    return {
      metrics: {
        wordCount,
        characterCount: text.length,
        sentenceCount: text.split(/[.!?]+/).filter(Boolean).length
      },
      sentiment: {
        score: sentimentResult.score,
        comparative: sentimentResult.comparative,
        positive: sentimentResult.positive,
        negative: sentimentResult.negative
      },
      emotions,
      language,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error in text analysis:', error);
    throw new Error('Failed to analyze text');
  }
};

/**
 * Simple language detection (placeholder)
 * @param {string} text - Text to detect language for
 * @returns {string} Detected language code
 */
const detectLanguage = (text) => {
  // This is a placeholder. For production, use a proper language detection library
  return 'en'; // Assuming English for now
};

const findNamedEntities = (text) => {
  // Simple named entity recognition
  // In a production environment, you would want to use a more sophisticated NER model
  const words = text.split(' ');
  const entities = words.filter(word => 
    word.length > 0 && word[0] === word[0].toUpperCase()
  );
  return entities;
};

const analyzeEmotions = (text) => {
  // Implement emotion analysis
  // This is a simplified version. In production, you'd want to use a proper emotion classification model
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0
  };

  const emotionKeywords = {
    joy: ['happy', 'glad', 'excited', 'delighted'],
    sadness: ['sad', 'unhappy', 'depressed', 'down'],
    anger: ['angry', 'mad', 'furious', 'annoyed'],
    fear: ['scared', 'afraid', 'terrified', 'worried'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished']
  };

  const lowercaseText = text.toLowerCase();
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (lowercaseText.includes(keyword)) {
        emotions[emotion] += 1;
      }
    });
  });

  return emotions;
};

const analyzeContext = (text) => {
  // Implement context analysis
  // This is a simplified version. In production, you'd want to use more sophisticated context analysis
  return {
    formality: detectFormality(text),
    topic: detectTopic(text),
    urgency: detectUrgency(text)
  };
};

const detectFormality = (text) => {
  const formalIndicators = ['would you', 'could you', 'please', 'kindly', 'regards'];
  const informalIndicators = ['hey', 'hi', 'yeah', 'cool', 'awesome'];
  
  let formalCount = 0;
  let informalCount = 0;
  
  const lowercaseText = text.toLowerCase();
  
  formalIndicators.forEach(indicator => {
    if (lowercaseText.includes(indicator)) formalCount++;
  });
  
  informalIndicators.forEach(indicator => {
    if (lowercaseText.includes(indicator)) informalCount++;
  });
  
  return formalCount > informalCount ? 'formal' : 'informal';
};

const detectTopic = (text) => {
  // Simple topic detection - in production, use a proper topic modeling approach
  const topics = {
    business: ['meeting', 'project', 'deadline', 'client'],
    personal: ['family', 'friend', 'home', 'love'],
    technical: ['bug', 'code', 'system', 'technical']
  };
  
  const lowercaseText = text.toLowerCase();
  let maxCount = 0;
  let detectedTopic = 'general';
  
  Object.entries(topics).forEach(([topic, keywords]) => {
    const count = keywords.filter(keyword => lowercaseText.includes(keyword)).length;
    if (count > maxCount) {
      maxCount = count;
      detectedTopic = topic;
    }
  });
  
  return detectedTopic;
};

const detectUrgency = (text) => {
  const urgentIndicators = ['urgent', 'asap', 'emergency', 'immediately', 'deadline'];
  const lowercaseText = text.toLowerCase();
  
  const urgencyScore = urgentIndicators.filter(indicator => 
    lowercaseText.includes(indicator)
  ).length;
  
  if (urgencyScore >= 2) return 'high';
  if (urgencyScore === 1) return 'medium';
  return 'low';
};

module.exports = {
  analyzeText
}; 