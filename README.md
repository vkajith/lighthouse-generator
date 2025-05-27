# Lighthouse Generator

A service that generates performance reports for web pages using Google's PageSpeed Insights API.

## Live Demo

🌐 [View Live Demo](https://vkajith.github.io/lighthouse-generator)

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure the following environment variables in your `.env` file:

### Application
- `NODE_ENV`: Environment (development/production)
- `PORT`: Port number for the application (default: 3000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend origins (e.g., "http://localhost:3000,https://your-domain.com")

### MongoDB
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_PORT`: MongoDB port (default: 27017)
- `MONGO_ROOT_USERNAME`: MongoDB root username (optional)
- `MONGO_ROOT_PASSWORD`: MongoDB root password (optional)

### OpenAI
- `OPENAI_API_KEY`: Your OpenAI API key

### PageSpeed Insights
- `PAGESPEED_API_KEY`: Your Google PageSpeed Insights API key

## Running with Docker

1. Build and start the services:
```bash
docker-compose up --build
```

2. For production:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Security Notes

- Never commit the `.env` file to version control
- Use strong passwords for MongoDB in production
- Keep your API keys secure
- The application runs as a non-root user in the container
- CORS is configured to only allow specified origins

## Development

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Features

- Generate performance reports for any URL using Google's PageSpeed Insights API
- View detailed performance metrics including:
  - Performance Score
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Time to Interactive (TTI)
  - Total Blocking Time (TBT)
  - Cumulative Layout Shift (CLS)
- Interactive charts and visualizations
- Detailed recommendations for performance improvements
- Mobile and desktop testing options
- CORS support for secure cross-origin requests
- Rate limiting to prevent abuse

## Tech Stack

### Frontend
- React.js
- Material-UI
- Recharts for data visualization
- Axios for API calls

### Backend
- Node.js
- Express.js
- Google PageSpeed Insights API
- OpenAI for AI-powered recommendations
- MongoDB for data storage
- CORS for secure cross-origin requests
- Rate limiting for API protection

## API Endpoints

- `POST /api/lighthouse/generate`: Generate a new performance report
- `GET /api/lighthouse/reports/:id`: Get a report by ID
- `GET /api/lighthouse/reports/:id/download`: Download report in HTML format
- `GET /api/lighthouse/reports/:id/download-json`: Download report in JSON format
- `GET /health`: Health check endpoint

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Environment Variables

Frontend (.env.development):
```
REACT_APP_API_URL=http://localhost:3000
```

Backend (.env):
```
PORT=3000
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
ALLOWED_ORIGINS=http://localhost:3001
```

## Deployment

The application is deployed using:
- Frontend: GitHub Pages
- Backend: Render.com

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/vkajith/lighthouse-generator](https://github.com/vkajith/lighthouse-generator) 