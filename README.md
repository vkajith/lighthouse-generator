# Lighthouse Generator

A web application that generates Lighthouse performance reports for any URL, providing detailed insights and recommendations for web performance optimization.

## Live Demo

🌐 [View Live Demo](https://vkajith.github.io/lighthouse-generator)

## Features

- Generate Lighthouse performance reports for any URL
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

## Tech Stack

### Frontend
- React.js
- Material-UI
- Recharts for data visualization
- Axios for API calls

### Backend
- Node.js
- Express.js
- Puppeteer for Lighthouse integration
- MongoDB for data storage

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
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/vkajith/lighthouse-generator](https://github.com/vkajith/lighthouse-generator) 