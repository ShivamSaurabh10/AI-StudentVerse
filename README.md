# AI-Powered Conversational Intelligence Platform

A sophisticated platform that analyzes conversations using advanced NLP, emotion recognition, and context awareness to decode meaning, tone, and emotional undercurrents in real-time or post-analysis mode.

## Features

- Real-time conversation analysis
- Emotion recognition and sentiment analysis
- Context-aware interpretation
- Historical conversation analysis
- Interactive visualization of conversation insights
- User authentication and data security
- RESTful API endpoints

## Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6+)
- Material-UI
- Chart.js for visualizations

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- Natural Language Processing (NLP) libraries
- WebSocket for real-time communication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository
2. Install dependencies:

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/conv-intelligence
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Documentation

API documentation can be found in the `/backend/docs` directory.

## License

MIT License 