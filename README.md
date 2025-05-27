# Lighthouse Report Generator

A full-stack application that generates detailed Lighthouse reports for any website, with AI-powered recommendations.

## Features

- Run Lighthouse audits on any URL
- View detailed performance metrics
- Get AI-powered recommendations
- Download reports in HTML or JSON format
- Modern, responsive UI
- Real-time analysis

## Tech Stack

### Frontend
- React
- Material-UI
- Recharts for data visualization
- GitHub Pages for hosting

### Backend
- Node.js/Express
- MongoDB
- OpenAI API for recommendations
- Render for hosting

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB
- OpenAI API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lighthouse-generator.git
cd lighthouse-generator
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment files:

Backend (.env):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/lighthouse
OPENAI_API_KEY=your_openai_api_key
ALLOWED_ORIGINS=http://localhost:3000
```

Frontend (.env):
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. Start the development servers:

```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm start
```

## Deployment

### Backend Deployment (Render)

1. Create a Render account and new Web Service
2. Connect your GitHub repository
3. Configure environment variables:
   - MONGO_URI
   - OPENAI_API_KEY
   - ALLOWED_ORIGINS (set to your GitHub Pages URL)
4. Deploy

### Frontend Deployment (GitHub Pages)

1. Update the homepage in frontend/package.json:
```json
{
  "homepage": "https://yourusername.github.io/lighthouse-generator"
}
```

2. Add GitHub Secrets:
   - Go to repository Settings > Secrets and variables > Actions
   - Add BACKEND_URL secret with your Render backend URL

3. Push to main branch to trigger deployment

## Environment Variables

### Backend
- PORT: Server port (default: 5000)
- MONGO_URI: MongoDB connection string
- OPENAI_API_KEY: OpenAI API key
- ALLOWED_ORIGINS: Comma-separated list of allowed origins

### Frontend
- REACT_APP_BACKEND_URL: Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 