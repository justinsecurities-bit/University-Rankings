import { updateRanking } from '../../../queries.js';

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
    const { universityId, provider, rank, overallScore } = req.body;

    if (!universityId || !provider || rank === undefined || overallScore === undefined) {
      return res.status(400).json({ error: 'universityId, provider, rank, and overallScore are required' });
    }

    if (!['THE', 'QS', 'ARWU'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider. Must be THE, QS, or ARWU' });
    }

    const ranking = await updateRanking(universityId, provider, rank, overallScore);
    res.status(200).json(ranking);
  } catch (error) {
    console.error('API Error:', error);
    res.status(400).json({ error: error.message || 'Failed to update ranking' });
  }
}
