const logger = require('./utils/logger');
const { analyzeText } = require('./services/nlpService');
const { processImageAnalysis } = require('./services/imageService');

const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Send a welcome message to confirm connection
    socket.emit('connected', { message: 'Connected to server successfully' });

    socket.on('analyze-text', async (data) => {
      try {
        logger.info(`Analyzing text from client ${socket.id}`);
        const analysis = await analyzeText(data.text);
        socket.emit('analysis-result', analysis);
      } catch (error) {
        logger.error('Error analyzing text:', error);
        socket.emit('analysis-error', { message: 'Error analyzing text' });
      }
    });

    socket.on('analyze-face', async (data) => {
      try {
        logger.info(`Analyzing face data from client ${socket.id}`);
        // Process face emotion data
        const analysis = {
          emotions: data.expressions,
          dominantEmotion: data.emotion,
          timestamp: new Date().toISOString()
        };
        socket.emit('face-analysis-result', analysis);
      } catch (error) {
        logger.error('Error analyzing face data:', error);
        socket.emit('analysis-error', { message: 'Error analyzing face data' });
      }
    });
    
    socket.on('analyze-image', async (data) => {
      try {
        logger.info(`Processing image analysis from client ${socket.id}`);
        // Process the image analysis data from frontend
        const enhancedAnalysis = await processImageAnalysis(data);
        socket.emit('image-analysis-result', enhancedAnalysis);
      } catch (error) {
        logger.error('Error processing image analysis:', error);
        socket.emit('analysis-error', { message: 'Error processing image analysis' });
      }
    });

    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
      logger.info(`Client ${socket.id} joined conversation: ${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
      logger.info(`Client ${socket.id} left conversation: ${conversationId}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for client ${socket.id}:`, error);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  // Handle server-wide errors
  io.engine.on('connection_error', (err) => {
    logger.error('Socket.IO connection error:', err);
  });
};

module.exports = { setupWebSocket }; 