import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { analyzeStaticImage } from '../utils/faceDetection';
import { io } from 'socket.io-client';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ImageAnalysisDisplay = ({ imageUrl, onAnalysisComplete }) => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [enhancedAnalysis, setEnhancedAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Socket connected for image analysis');
    });

    newSocket.on('image-analysis-result', (data) => {
      console.log('Received enhanced analysis from server:', data);
      setEnhancedAnalysis(data);
    });

    newSocket.on('analysis-error', (error) => {
      console.error('Analysis error from server:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!imageUrl) return;

    const analyzeImage = async () => {
      setIsAnalyzing(true);
      setError(null);

      const img = new Image();
      img.crossOrigin = 'anonymous';  // To avoid CORS issues with canvas
      img.src = imageUrl;

      img.onload = async () => {
        if (imageRef.current) {
          imageRef.current.width = img.width;
          imageRef.current.height = img.height;
          
          // Set canvas dimensions
          if (canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
          }

          try {
            // Analyze the image
            const result = await analyzeStaticImage(img, canvasRef.current);
            setAnalysisResult(result);
            
            // Send results to server for additional processing
            if (socket && socket.connected && result) {
              socket.emit('analyze-image', result);
            }
            
            // Notify parent component
            if (onAnalysisComplete) {
              onAnalysisComplete(result);
            }
          } catch (err) {
            console.error('Error analyzing image:', err);
            setError('Failed to analyze image');
          } finally {
            setIsAnalyzing(false);
          }
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
        setIsAnalyzing(false);
      };
    };

    analyzeImage();
  }, [imageUrl, socket, onAnalysisComplete]);

  // Helper function to get color for emotion value
  const getEmotionColor = (value) => {
    if (value < 0.2) return '#e0e0e0';
    if (value < 0.4) return '#c5e1a5';
    if (value < 0.6) return '#fff176';
    if (value < 0.8) return '#ffb74d';
    return '#ef5350';
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 2, 
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100%',
        mb: 2
      }}
    >
      {isAnalyzing && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 5
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Analyzing image...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ position: 'relative', mb: 2 }}>
        {/* Original image element for reference */}
        <img 
          ref={imageRef}
          src={imageUrl} 
          alt="Uploaded for analysis" 
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            display: 'block'
          }} 
        />
        
        {/* Canvas overlay for drawing faces and expressions */}
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2
          }}
        />
      </Box>

      {analysisResult && analysisResult.isDetected && (
        <>
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>

          <Typography variant="body2" gutterBottom>
            Dominant emotion: <strong>{analysisResult.dominantEmotion}</strong>
          </Typography>

          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body2" gutterBottom>
              Detected Emotions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(analysisResult.expressions).map(([emotion, value]) => (
                <Chip 
                  key={emotion}
                  label={`${emotion}: ${(value * 100).toFixed(0)}%`}
                  sx={{ 
                    backgroundColor: getEmotionColor(value),
                    fontWeight: analysisResult.dominantEmotion === emotion ? 'bold' : 'normal',
                  }}
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {analysisResult.skinAnalysis && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Skin Analysis:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Texture: <strong>{analysisResult.skinAnalysis.texture}</strong>
              </Typography>
            </Box>
          )}
          
          {/* Display enhanced analysis from server */}
          {enhancedAnalysis && enhancedAnalysis.success && enhancedAnalysis.analysis.recommendations && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Recommendations:
              </Typography>
              <List dense>
                {enhancedAnalysis.analysis.recommendations.map((recommendation, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          
          {enhancedAnalysis && enhancedAnalysis.analysis.skin && enhancedAnalysis.analysis.skin.recommendations && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                Skin Care Suggestions:
              </Typography>
              <List dense>
                {enhancedAnalysis.analysis.skin.recommendations.map((recommendation, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircleIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </>
      )}

      {analysisResult && !analysisResult.isDetected && (
        <Typography variant="body2">
          No faces detected in the image. This might be a different type of medical image.
        </Typography>
      )}
    </Paper>
  );
};

export default ImageAnalysisDisplay; 