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
