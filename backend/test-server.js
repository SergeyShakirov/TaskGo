import express from 'express';

const app = express();
const PORT = 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskGo Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
});
