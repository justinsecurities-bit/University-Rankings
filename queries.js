import pool from './db.js';

export async function getUniversities(filters = {}) {
  let query = `
    SELECT u.id, u.name, u.country, u.region,
           (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'THE') as the_rank,
           (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'QS') as qs_rank,
           (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'ARWU') as arwu_rank,
           ROUND(((SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'THE')::decimal +
                  (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'QS')::decimal +
                  (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'ARWU')::decimal) / 3, 1) as avg_rank
    FROM universities u
  `;
  
  const conditions = [];
  const params = [];
  let paramCount = 1;
  
  if (filters.search) {
    conditions.push(`(u.name ILIKE $${paramCount} OR u.country ILIKE $${paramCount})`);
    params.push(`%${filters.search}%`);
    paramCount++;
  }
  
  if (filters.country) {
    conditions.push(`u.country = $${paramCount}`);
    params.push(filters.country);
    paramCount++;
  }
  
  if (filters.region) {
    conditions.push(`u.region = $${paramCount}`);
    params.push(filters.region);
    paramCount++;
  }
  
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  query += ` ORDER BY avg_rank ASC`;
  
  const result = await pool.query(query, params);
  return result.rows;
}

export async function getUniversityById(id) {
  const result = await pool.query(
    `SELECT u.*, 
            json_build_object('rank', (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'THE'),
                              'overall', (SELECT overall_score FROM rankings WHERE university_id = u.id AND ranking_provider = 'THE'),
                              'teaching', (SELECT teaching FROM the_metrics WHERE university_id = u.id),
                              'research', (SELECT research FROM the_metrics WHERE university_id = u.id),
                              'citations', (SELECT citations FROM the_metrics WHERE university_id = u.id),
                              'international_outlook', (SELECT international_outlook FROM the_metrics WHERE university_id = u.id)) as the,
            json_build_object('rank', (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'QS'),
                              'overall', (SELECT overall_score FROM rankings WHERE university_id = u.id AND ranking_provider = 'QS'),
                              'academic_reputation', (SELECT academic_reputation FROM qs_metrics WHERE university_id = u.id),
                              'employer_reputation', (SELECT employer_reputation FROM qs_metrics WHERE university_id = u.id),
                              'faculty_student', (SELECT faculty_student_ratio FROM qs_metrics WHERE university_id = u.id),
                              'citations_per_faculty', (SELECT citations_per_faculty FROM qs_metrics WHERE university_id = u.id),
                              'international_faculty', (SELECT international_faculty FROM qs_metrics WHERE university_id = u.id),
                              'international_students', (SELECT international_students FROM qs_metrics WHERE university_id = u.id)) as qs,
            json_build_object('rank', (SELECT rank FROM rankings WHERE university_id = u.id AND ranking_provider = 'ARWU'),
                              'overall', (SELECT overall_score FROM rankings WHERE university_id = u.id AND ranking_provider = 'ARWU'),
                              'alumni', (SELECT alumni FROM arwu_metrics WHERE university_id = u.id),
                              'award', (SELECT award FROM arwu_metrics WHERE university_id = u.id),
                              'hici', (SELECT hici FROM arwu_metrics WHERE university_id = u.id),
                              'ns', (SELECT ns FROM arwu_metrics WHERE university_id = u.id),
                              'pub', (SELECT pub FROM arwu_metrics WHERE university_id = u.id),
                              'pcp', (SELECT pcp FROM arwu_metrics WHERE university_id = u.id)) as arwu
     FROM universities u WHERE u.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function getCountries() {
  const result = await pool.query('SELECT DISTINCT country FROM universities ORDER BY country');
  return result.rows.map(r => r.country);
}

export async function getRegions() {
  const result = await pool.query('SELECT DISTINCT region FROM universities ORDER BY region');
  return result.rows.map(r => r.region);
}

export async function searchUniversities(query, filters = {}) {
  return getUniversities({
    search: query,
    ...filters
  });
}

// Mutation functions for database modifications

export async function createUniversity(name, country, region) {
  try {
    const result = await pool.query(
      'INSERT INTO universities (name, country, region) VALUES ($1, $2, $3) RETURNING *',
      [name, country, region]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('University name already exists');
    }
    throw error;
  }
}

export async function updateUniversity(id, name, country, region) {
  const result = await pool.query(
    'UPDATE universities SET name = $1, country = $2, region = $3 WHERE id = $4 RETURNING *',
    [name, country, region, id]
  );
  return result.rows[0];
}

export async function deleteUniversity(id) {
  const result = await pool.query(
    'DELETE FROM universities WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

export async function updateRanking(universityId, provider, rank, overallScore) {
  const result = await pool.query(
    `INSERT INTO rankings (university_id, ranking_provider, rank, overall_score) 
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (university_id, ranking_provider) DO UPDATE SET rank = $3, overall_score = $4
     RETURNING *`,
    [universityId, provider, rank, overallScore]
  );
  return result.rows[0];
}

export async function updateTHEMetrics(universityId, metrics) {
  const { teaching, research, citations, internationalOutlook } = metrics;
  const result = await pool.query(
    `INSERT INTO the_metrics (university_id, teaching, research, citations, international_outlook) 
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (university_id) DO UPDATE SET 
       teaching = $2, research = $3, citations = $4, international_outlook = $5
     RETURNING *`,
    [universityId, teaching, research, citations, internationalOutlook]
  );
  return result.rows[0];
}

export async function updateQSMetrics(universityId, metrics) {
  const { academicReputation, employerReputation, facultyStudent, citationsPerFaculty, internationalFaculty, internationalStudents } = metrics;
  const result = await pool.query(
    `INSERT INTO qs_metrics (university_id, academic_reputation, employer_reputation, faculty_student_ratio, citations_per_faculty, international_faculty, international_students) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (university_id) DO UPDATE SET 
       academic_reputation = $2, employer_reputation = $3, faculty_student_ratio = $4, 
       citations_per_faculty = $5, international_faculty = $6, international_students = $7
     RETURNING *`,
    [universityId, academicReputation, employerReputation, facultyStudent, citationsPerFaculty, internationalFaculty, internationalStudents]
  );
  return result.rows[0];
}

export async function updateARWUMetrics(universityId, metrics) {
  const { alumni, award, hici, ns, pub, pcp } = metrics;
  const result = await pool.query(
    `INSERT INTO arwu_metrics (university_id, alumni, award, hici, ns, pub, pcp) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (university_id) DO UPDATE SET 
       alumni = $2, award = $3, hici = $4, ns = $5, pub = $6, pcp = $7
     RETURNING *`,
    [universityId, alumni, award, hici, ns, pub, pcp]
  );
  return result.rows[0];
}
