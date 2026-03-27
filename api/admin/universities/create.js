import { 
  createUniversity, 
  updateUniversity, 
  deleteUniversity,
  updateRanking,
  updateTHEMetrics,
  updateQSMetrics,
  updateARWUMetrics
} from '../../queries.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, country, region } = req.body;

    if (!name || !country || !region) {
      return res.status(400).json({ error: 'Name, country, and region are required' });
    }

    const university = await createUniversity(name, country, region);
    res.status(201).json(university);
  } catch (error) {
    console.error('API Error:', error);
    res.status(400).json({ error: error.message || 'Failed to create university' });
  }
}
