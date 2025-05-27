import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    if (!response.ok) {
      throw new Error('Backend server is not responding');
    }
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding. Please make sure the server is running.');
  }
};

export const generateReport = async (url) => {
  try {
    const response = await api.post('/api/lighthouse/generate', { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to generate report');
    }
    throw new Error('Failed to connect to the server');
  }
};

export const downloadReport = async (reportId, format) => {
  try {
    const response = await api.get(`/api/lighthouse/download/${reportId}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to download report');
  }
}; 