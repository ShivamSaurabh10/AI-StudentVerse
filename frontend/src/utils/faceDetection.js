import * as faceapi from 'face-api.js';

// CDN base URL for face-api.js models
const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Load face-api models
export const loadFaceDetectionModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    ]);
    console.log('Face-api models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face-api models:', error);
    return false;
  }
};

// Detect faces in a video element
export const detectFaces = async (videoElement, canvasElement) => {
  if (!videoElement || !canvasElement) return null;

  // Make sure video dimensions are set correctly
  const displaySize = { 
    width: videoElement.videoWidth || videoElement.width || 640, 
    height: videoElement.videoHeight || videoElement.height || 480 
  };
  
  // Set canvas size to match video
  faceapi.matchDimensions(canvasElement, displaySize);
  
  try {
    // Detect faces with expressions
    const detections = await faceapi.detectAllFaces(
      videoElement, 
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320 })
    ).withFaceExpressions();
    
    // Resize detections to match canvas size
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // Clear previous drawings
    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw detections only if faces are detected
    if (resizedDetections.length > 0) {
      faceapi.draw.drawDetections(canvasElement, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasElement, resizedDetections);
      
      // Get the dominant emotion from the first detected face
      const expressions = resizedDetections[0].expressions;
      const dominantEmotion = Object.entries(expressions)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      return {
        isDetected: true,
        dominantEmotion,
        expressions,
        detections: resizedDetections
      };
    } else {
      return {
        isDetected: false,
        dominantEmotion: null,
        expressions: null,
        detections: []
      };
    }
  } catch (error) {
    console.error('Face detection error:', error);
    return null;
  }
};

// Analyze static image for facial expressions and skin features
export const analyzeStaticImage = async (imageElement, canvasElement) => {
  if (!imageElement || !canvasElement) return null;

  try {
    // Make sure image dimensions are set correctly
    const displaySize = { 
      width: imageElement.width || 640, 
      height: imageElement.height || 480 
    };
    
    // Set canvas size to match image
    faceapi.matchDimensions(canvasElement, displaySize);
    
    // Detect faces with expressions
    const detections = await faceapi.detectAllFaces(
      imageElement, 
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320 })
    ).withFaceExpressions().withFaceLandmarks();
    
    // Resize detections to match canvas size
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // Clear previous drawings
    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw detections only if faces are detected
    if (resizedDetections.length > 0) {
      faceapi.draw.drawDetections(canvasElement, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasElement, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasElement, resizedDetections);
      
      // Get the dominant emotion from the first detected face
      const expressions = resizedDetections[0].expressions;
      const dominantEmotion = Object.entries(expressions)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      // Analyze skin features (basic implementation)
      const skinAnalysis = {
        texture: "normal", // This would need a more complex algorithm for actual skin analysis
        concerns: [],
        recommendations: []
      };
      
      return {
        isDetected: true,
        dominantEmotion,
        expressions,
        detections: resizedDetections,
        skinAnalysis
      };
    } else {
      return {
        isDetected: false,
        dominantEmotion: null,
        expressions: null,
        detections: [],
        skinAnalysis: null
      };
    }
  } catch (error) {
    console.error('Static image analysis error:', error);
    return null;
  }
}; 