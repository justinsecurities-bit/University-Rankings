import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUniversities, getUniversityById, getCountries, getRegions, searchUniversities } from './queries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API Routes

// Get all universities with optional filters
app.get('/api/universities', async (req, res) => {
  try {
    const { search, country, region } = req.query;
    const universities = await getUniversities({
      search,
      country,
      region
    });
    res.json(universities);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

// Get specific university
app.get('/api/universities/:id', async (req, res) => {
  try {
    const university = await getUniversityById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    res.json(university);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch university' });
  }
});

// Search universities
app.get('/api/search', async (req, res) => {
  try {
    const { q, country, region } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    const results = await searchUniversities(q, { country, region });
    res.json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get countries
app.get('/api/countries', async (req, res) => {
  try {
    const countries = await getCountries();
    res.json(countries);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Get regions
app.get('/api/regions', async (req, res) => {
  try {
    const regions = await getRegions();
    res.json(regions);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
