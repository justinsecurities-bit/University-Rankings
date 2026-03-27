import { deleteUniversity } from '../../../queries.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const university = await deleteUniversity(id);
    
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.status(200).json({ message: 'University deleted successfully', university });
  } catch (error) {
    console.error('API Error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete university' });
  }
}
