import { getUniversityById } from '../../queries.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;
    const university = await getUniversityById(id);
    
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    res.status(200).json(university);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch university' });
  }
}
