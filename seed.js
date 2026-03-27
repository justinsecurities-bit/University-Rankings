import pool from './db.js';

function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function scoreFromRank(rank, spread = 0.2) {
  const base = 100 - rank * 0.55;
  return Math.max(45, Math.min(99.5, Number((base + spread).toFixed(1))));
}

function shuffledRanks(seedOffset) {
  const arr = Array.from({ length: 100 }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seeded(i * 71 + seedOffset) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const universitySeeds = [
  ["Massachusetts Institute of Technology", "United States", "North America"],
  ["University of Oxford", "United Kingdom", "Europe"],
  ["Stanford University", "United States", "North America"],
  ["University of Cambridge", "United Kingdom", "Europe"],
  ["Harvard University", "United States", "North America"],
  ["California Institute of Technology", "United States", "North America"],
  ["Princeton University", "United States", "North America"],
  ["Yale University", "United States", "North America"],
  ["Columbia University", "United States", "North America"],
  ["University of Chicago", "United States", "North America"],
  ["University of Pennsylvania", "United States", "North America"],
  ["Cornell University", "United States", "North America"],
  ["Johns Hopkins University", "United States", "North America"],
  ["University of California, Los Angeles", "United States", "North America"],
  ["University of California, Berkeley", "United States", "North America"],
  ["Northwestern University", "United States", "North America"],
  ["Duke University", "United States", "North America"],
  ["University of Michigan", "United States", "North America"],
  ["Carnegie Mellon University", "United States", "North America"],
  ["New York University", "United States", "North America"],
  ["ETH Zurich", "Switzerland", "Europe"],
  ["EPFL", "Switzerland", "Europe"],
  ["Imperial College London", "United Kingdom", "Europe"],
  ["University College London", "United Kingdom", "Europe"],
  ["King's College London", "United Kingdom", "Europe"],
  ["University of Edinburgh", "United Kingdom", "Europe"],
  ["University of Manchester", "United Kingdom", "Europe"],
  ["University of Bristol", "United Kingdom", "Europe"],
  ["University of Glasgow", "United Kingdom", "Europe"],
  ["University of Birmingham", "United Kingdom", "Europe"],
  ["London School of Economics and Political Science", "United Kingdom", "Europe"],
  ["University of Warwick", "United Kingdom", "Europe"],
  ["University of Amsterdam", "Netherlands", "Europe"],
  ["Leiden University", "Netherlands", "Europe"],
  ["Utrecht University", "Netherlands", "Europe"],
  ["Delft University of Technology", "Netherlands", "Europe"],
  ["Erasmus University Rotterdam", "Netherlands", "Europe"],
  ["KU Leuven", "Belgium", "Europe"],
  ["Ghent University", "Belgium", "Europe"],
  ["University of Copenhagen", "Denmark", "Europe"],
  ["Aarhus University", "Denmark", "Europe"],
  ["Lund University", "Sweden", "Europe"],
  ["Uppsala University", "Sweden", "Europe"],
  ["Karolinska Institute", "Sweden", "Europe"],
  ["LMU Munich", "Germany", "Europe"],
  ["Technical University of Munich", "Germany", "Europe"],
  ["Heidelberg University", "Germany", "Europe"],
  ["Humboldt University of Berlin", "Germany", "Europe"],
  ["RWTH Aachen University", "Germany", "Europe"],
  ["Free University of Berlin", "Germany", "Europe"],
  ["Sorbonne University", "France", "Europe"],
  ["PSL University", "France", "Europe"],
  ["Paris-Saclay University", "France", "Europe"],
  ["Ecole Polytechnique", "France", "Europe"],
  ["Aix-Marseille University", "France", "Europe"],
  ["Sapienza University of Rome", "Italy", "Europe"],
  ["University of Bologna", "Italy", "Europe"],
  ["University of Padua", "Italy", "Europe"],
  ["University of Milan", "Italy", "Europe"],
  ["University of Barcelona", "Spain", "Europe"],
  ["Autonomous University of Barcelona", "Spain", "Europe"],
  ["Complutense University of Madrid", "Spain", "Europe"],
  ["Pompeu Fabra University", "Spain", "Europe"],
  ["University of Zurich", "Switzerland", "Europe"],
  ["University of Geneva", "Switzerland", "Europe"],
  ["University of Vienna", "Austria", "Europe"],
  ["TU Wien", "Austria", "Europe"],
  ["Trinity College Dublin", "Ireland", "Europe"],
  ["University College Dublin", "Ireland", "Europe"],
  ["University of Toronto", "Canada", "North America"],
  ["University of British Columbia", "Canada", "North America"],
  ["McGill University", "Canada", "North America"],
  ["McMaster University", "Canada", "North America"],
  ["University of Alberta", "Canada", "North America"],
  ["University of Waterloo", "Canada", "North America"],
  ["University of Montreal", "Canada", "North America"],
  ["University of Sydney", "Australia", "Oceania"],
  ["University of Melbourne", "Australia", "Oceania"],
  ["Australian National University", "Australia", "Oceania"],
  ["UNSW Sydney", "Australia", "Oceania"],
  ["Monash University", "Australia", "Oceania"],
  ["University of Queensland", "Australia", "Oceania"],
  ["University of Auckland", "New Zealand", "Oceania"],
  ["University of Otago", "New Zealand", "Oceania"],
  ["National University of Singapore", "Singapore", "Asia"],
  ["Nanyang Technological University", "Singapore", "Asia"],
  ["Tsinghua University", "China", "Asia"],
  ["Peking University", "China", "Asia"],
  ["Fudan University", "China", "Asia"],
  ["Shanghai Jiao Tong University", "China", "Asia"],
  ["Zhejiang University", "China", "Asia"],
  ["University of Science and Technology of China", "China", "Asia"],
  ["Nanjing University", "China", "Asia"],
  ["University of Tokyo", "Japan", "Asia"],
  ["Kyoto University", "Japan", "Asia"],
  ["Osaka University", "Japan", "Asia"],
  ["Tohoku University", "Japan", "Asia"],
  ["Seoul National University", "South Korea", "Asia"],
  ["KAIST", "South Korea", "Asia"],
  ["Yonsei University", "South Korea", "Asia"],
];

const thePermutation = shuffledRanks(11);
const qsPermutation = shuffledRanks(23);
const arwuPermutation = shuffledRanks(37);

const rankingData = universitySeeds.map(([name, country, region], i) => {
  const theRank = thePermutation[i];
  const qsRank = qsPermutation[i];
  const arwuRank = arwuPermutation[i];
  const theOverall = scoreFromRank(theRank, seeded(i + 1) * 0.25);
  const qsOverall = scoreFromRank(qsRank, seeded(i + 31) * 0.28);
  const arwuOverall = scoreFromRank(arwuRank, seeded(i + 61) * 0.2);
  const avgRank = Number(((theRank + qsRank + arwuRank) / 3).toFixed(1));

  return {
    id: i + 1,
    name,
    country,
    region,
    theRank,
    qsRank,
    arwuRank,
    avgRank,
    rankings: {
      the: {
        rank: theRank,
        overall: theOverall,
        teaching: Number((theOverall - 3 + seeded(i + 3) * 6).toFixed(1)),
        research: Number((theOverall - 2 + seeded(i + 4) * 5).toFixed(1)),
        citations: Number((theOverall - 4 + seeded(i + 5) * 7).toFixed(1)),
        internationalOutlook: Number((theOverall - 5 + seeded(i + 6) * 8).toFixed(1)),
      },
      qs: {
        rank: qsRank,
        overall: qsOverall,
        academicReputation: Number((qsOverall - 2 + seeded(i + 7) * 5).toFixed(1)),
        employerReputation: Number((qsOverall - 3 + seeded(i + 8) * 6).toFixed(1)),
        facultyStudent: Number((qsOverall - 4 + seeded(i + 9) * 7).toFixed(1)),
        citationsPerFaculty: Number((qsOverall - 3 + seeded(i + 10) * 6).toFixed(1)),
        internationalFaculty: Number((qsOverall - 5 + seeded(i + 11) * 9).toFixed(1)),
        internationalStudents: Number((qsOverall - 5 + seeded(i + 12) * 9).toFixed(1)),
      },
      arwu: {
        rank: arwuRank,
        overall: arwuOverall,
        alumni: Number((arwuOverall - 5 + seeded(i + 13) * 10).toFixed(1)),
        award: Number((arwuOverall - 6 + seeded(i + 14) * 10).toFixed(1)),
        hici: Number((arwuOverall - 4 + seeded(i + 15) * 8).toFixed(1)),
        ns: Number((arwuOverall - 3 + seeded(i + 16) * 7).toFixed(1)),
        pub: Number((arwuOverall - 2 + seeded(i + 17) * 5).toFixed(1)),
        pcp: Number((arwuOverall - 4 + seeded(i + 18) * 8).toFixed(1)),
      },
    },
  };
});

async function createTables() {
  try {
    console.log('Creating tables...');
    
    // Universities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        country VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Rankings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rankings (
        id SERIAL PRIMARY KEY,
        university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
        ranking_provider VARCHAR(20) NOT NULL,
        rank INTEGER NOT NULL,
        overall_score NUMERIC(5,1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // THE Rankings metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS the_metrics (
        id SERIAL PRIMARY KEY,
        university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
        teaching NUMERIC(5,1),
        research NUMERIC(5,1),
        citations NUMERIC(5,1),
        international_outlook NUMERIC(5,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // QS Rankings metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qs_metrics (
        id SERIAL PRIMARY KEY,
        university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
        academic_reputation NUMERIC(5,1),
        employer_reputation NUMERIC(5,1),
        faculty_student_ratio NUMERIC(5,1),
        citations_per_faculty NUMERIC(5,1),
        international_faculty NUMERIC(5,1),
        international_students NUMERIC(5,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // ARWU Rankings metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS arwu_metrics (
        id SERIAL PRIMARY KEY,
        university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
        alumni NUMERIC(5,1),
        award NUMERIC(5,1),
        hici NUMERIC(5,1),
        ns NUMERIC(5,1),
        pub NUMERIC(5,1),
        pcp NUMERIC(5,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function seedData() {
  try {
    console.log('Seeding ranking data...');
    
    for (const uni of rankingData) {
      // Insert university
      const uniResult = await pool.query(
        'INSERT INTO universities (name, country, region) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [uni.name, uni.country, uni.region]
      );
      
      const universityId = uniResult.rows[0].id;
      
      // Insert THE ranking
      await pool.query(
        'INSERT INTO rankings (university_id, ranking_provider, rank, overall_score) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [universityId, 'THE', uni.theRank, uni.rankings.the.overall]
      );
      
      // Insert QS ranking
      await pool.query(
        'INSERT INTO rankings (university_id, ranking_provider, rank, overall_score) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [universityId, 'QS', uni.qsRank, uni.rankings.qs.overall]
      );
      
      // Insert ARWU ranking
      await pool.query(
        'INSERT INTO rankings (university_id, ranking_provider, rank, overall_score) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [universityId, 'ARWU', uni.arwuRank, uni.rankings.arwu.overall]
      );
      
      // Insert THE metrics
      await pool.query(
        'INSERT INTO the_metrics (university_id, teaching, research, citations, international_outlook) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [universityId, uni.rankings.the.teaching, uni.rankings.the.research, uni.rankings.the.citations, uni.rankings.the.internationalOutlook]
      );
      
      // Insert QS metrics
      await pool.query(
        'INSERT INTO qs_metrics (university_id, academic_reputation, employer_reputation, faculty_student_ratio, citations_per_faculty, international_faculty, international_students) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
        [universityId, uni.rankings.qs.academicReputation, uni.rankings.qs.employerReputation, uni.rankings.qs.facultyStudent, uni.rankings.qs.citationsPerFaculty, uni.rankings.qs.internationalFaculty, uni.rankings.qs.internationalStudents]
      );
      
      // Insert ARWU metrics
      await pool.query(
        'INSERT INTO arwu_metrics (university_id, alumni, award, hici, ns, pub, pcp) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
        [universityId, uni.rankings.arwu.alumni, uni.rankings.arwu.award, uni.rankings.arwu.hici, uni.rankings.arwu.ns, uni.rankings.arwu.pub, uni.rankings.arwu.pcp]
      );
    }
    
    console.log(`✓ Successfully seeded ${rankingData.length} universities`);
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

async function initialize() {
  try {
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Connected to database:', result.rows[0]);
    
    await createTables();
    await seedData();
    
    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

initialize();
