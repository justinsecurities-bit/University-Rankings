# PostgreSQL Database Setup for University Ranking App

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Your `.env` file is already configured with your Neon database connection string:
```
DATABASE_URL=postgresql://neondb_owner:npg_NF9Hb2uRoTQD@...
```

### 3. Initialize Database & Seed Data
Run the seed script to create tables and populate with ranking data:
```bash
npm run seed
```

This will:
- Create necessary tables (`universities`, `rankings`, `the_metrics`, `qs_metrics`, `arwu_metrics`)
- Populate 101 universities with their rankings
- Insert metrics for THE, QS, and ARWU ranking providers

## Database Schema

### Universities Table
```sql
CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Rankings Table
```sql
CREATE TABLE rankings (
  id SERIAL PRIMARY KEY,
  university_id INTEGER NOT NULL REFERENCES universities(id),
  ranking_provider VARCHAR(20) NOT NULL,  -- THE, QS, ARWU
  rank INTEGER NOT NULL,
  overall_score NUMERIC(5,1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### THE Metrics Table
```sql
CREATE TABLE the_metrics (
  id SERIAL PRIMARY KEY,
  university_id INTEGER NOT NULL REFERENCES universities(id),
  teaching NUMERIC(5,1),
  research NUMERIC(5,1),
  citations NUMERIC(5,1),
  international_outlook NUMERIC(5,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### QS Metrics Table
```sql
CREATE TABLE qs_metrics (
  id SERIAL PRIMARY KEY,
  university_id INTEGER NOT NULL REFERENCES universities(id),
  academic_reputation NUMERIC(5,1),
  employer_reputation NUMERIC(5,1),
  faculty_student_ratio NUMERIC(5,1),
  citations_per_faculty NUMERIC(5,1),
  international_faculty NUMERIC(5,1),
  international_students NUMERIC(5,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ARWU Metrics Table
```sql
CREATE TABLE arwu_metrics (
  id SERIAL PRIMARY KEY,
  university_id INTEGER NOT NULL REFERENCES universities(id),
  alumni NUMERIC(5,1),
  award NUMERIC(5,1),
  hici NUMERIC(5,1),
  ns NUMERIC(5,1),
  pub NUMERIC(5,1),
  pcp NUMERIC(5,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## File Structure

- **db.js** - Database connection pool configuration
- **seed.js** - Database initialization and data seeding script
- **queries.js** - Query functions for fetching university data
- **.env** - Environment variables (contains DATABASE_URL)
- **package.json** - Node dependencies and scripts

## Querying the Data

Use the functions from `queries.js`:

```javascript
import { 
  getUniversities, 
  getUniversityById, 
  getCountries, 
  getRegions, 
  searchUniversities 
} from './queries.js';

// Get all universities with optional filters
const unis = await getUniversities({ 
  country: 'United States',
  region: 'North America'
});

// Search universities
const results = await searchUniversities('MIT');

// Get specific university with all metrics
const uni = await getUniversityById(1);

// Get available countries and regions
const countries = await getCountries();
const regions = await getRegions();
```

## Data Included

- **101 Universities** across 6 regions:
  - North America
  - Europe
  - Asia
  - Oceania
  - Africa (if applicable)

- **3 Ranking Providers**:
  - THE (Times Higher Education)
  - QS (QS World University Rankings)
  - ARWU (Shanghai Ranking)

- **Multiple Metrics** per provider for comprehensive comparison

## Next Steps

1. Run `npm run seed` to populate the database
2. Integrate the `queries.js` functions into your frontend
3. Build API endpoints using Express/Node.js if needed
4. Update your frontend to fetch from the database instead of in-memory data

## Troubleshooting

- **Connection Error**: Verify your `.env` has the correct DATABASE_URL
- **SSL Error**: The connection is configured to use SSL (required by Neon)
- **Table Exists Error**: Tables use `IF NOT EXISTS` and won't error if already created
