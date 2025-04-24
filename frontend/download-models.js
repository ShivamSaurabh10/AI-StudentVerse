const https = require('https');
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'public', 'models');

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// List of model files to download
const modelFiles = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1'
];

// Base URL for the models
const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Download each model file
modelFiles.forEach(file => {
  const filePath = path.join(modelsDir, file);
  const url = `${baseUrl}/${file}`;
  
  console.log(`Downloading ${file}...`);
  
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${file}`);
      });
    } else {
      console.error(`Failed to download ${file}: ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${file}: ${err.message}`);
  });
});

console.log('Download process started. Please wait for all files to complete.'); 