import { updateQSMetrics } from '../../../queries.js';

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
    const { universityId, academicReputation, employerReputation, facultyStudent, citationsPerFaculty, internationalFaculty, internationalStudents } = req.body;

    if (!universityId) {
      return res.status(400).json({ error: 'universityId is required' });
    }

    const metrics = await updateQSMetrics(universityId, {
      academicReputation,
      employerReputation,
      facultyStudent,
      citationsPerFaculty,
      internationalFaculty,
      internationalStudents
    });

    res.status(200).json(metrics);
  } catch (error) {
    console.error('API Error:', error);
    res.status(400).json({ error: error.message || 'Failed to update QS metrics' });
  }
}
