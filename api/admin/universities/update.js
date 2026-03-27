import { updateUniversity } from '../../../queries.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, name, country, region } = req.body;

    if (!id || !name || !country || !region) {
      return res.status(400).json({ error: 'ID, name, country, and region are required' });
    }

    const university = await updateUniversity(id, name, country, region);
    
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.status(200).json(university);
  } catch (error) {
    console.error('API Error:', error);
    res.status(400).json({ error: error.message || 'Failed to update university' });
  }
}
