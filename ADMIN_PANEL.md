# Admin Panel - Database Management

## Overview

The Admin Panel provides a user-friendly interface to manually manage the university rankings database. You can add, edit, delete universities, and update their rankings and metrics across all three ranking providers (THE, QS, ARWU).

## Features

### 1. Add New University
Create a new university entry in the database.

**Fields:**
- **University Name** - The full name of the university
- **Country** - The country where the university is located
- **Region** - Geographic region (North America, Europe, Asia, Oceania, South America, Africa)

**Example:**
```
Name: "University of Test"
Country: "Testland"
Region: "Europe"
```

### 2. Edit University
Modify existing university information.

**Steps:**
1. Select a university from the dropdown
2. The form will auto-fill with current data
3. Make your changes
4. Click "Update University"

**Options:**
- Update university name, country, or region
- Click "Delete University" to remove a university entirely

### 3. Update Rankings
Change ranking positions and overall scores for each provider.

**Fields:**
- **University** - Select which university
- **Ranking Provider** - THE, QS, or ARWU
- **Rank** - The position number (1-100)
- **Overall Score** - Score out of 100 (45-99.5)

**Example:**
```
University: "MIT"
Provider: "THE"
Rank: 1
Overall Score: 98.5
```

### 4. Update Metrics
Modify detailed metrics for each ranking provider.

**THE Metrics:**
- Teaching
- Research
- Citations
- International Outlook

**QS Metrics:**
- Academic Reputation
- Employer Reputation
- Faculty/Student Ratio
- Citations Per Faculty
- International Faculty
- International Students

**ARWU Metrics:**
- Alumni
- Award
- HiCi
- Nature/Science
- Publications
- Per Capita Performance

All metrics are scored 0-100 (decimal values allowed).

## How to Use

### Access Admin Panel
1. Click the "Toggle Admin" button at the top of the Admin Panel section
2. The admin panel will expand showing all management forms

### Add a University
```javascript
1. Fill in the "Add New University" form
2. Click "Add University"
3. See success message confirming addition
```

### Edit a University
```javascript
1. Go to "Edit University" section
2. Select a university from the dropdown
3. Form auto-fills with current data
4. Update fields as needed
5. Click "Update University" to save
6. Click "Delete University" to remove it
```

### Update a Ranking
```javascript
1. Select university and provider
2. Enter new rank (1-100)
3. Enter new overall score (45-99.5)
4. Click "Update Ranking"
```

### Update Metrics
```javascript
1. Select university
2. Select provider (THE, QS, or ARWU)
3. Fill in metric values
4. Click "Update Metrics"
```

## API Endpoints

### Create University
**POST** `/api/admin/universities/create`
```json
{
  "name": "University Name",
  "country": "Country",
  "region": "Region"
}
```

### Update University
**PUT** `/api/admin/universities/update`
```json
{
  "id": 1,
  "name": "New Name",
  "country": "New Country",
  "region": "New Region"
}
```

### Delete University
**DELETE** `/api/admin/universities/delete`
```json
{
  "id": 1
}
```

### Update Ranking
**PUT** `/api/admin/rankings/update`
```json
{
  "universityId": 1,
  "provider": "THE",
  "rank": 10,
  "overallScore": 87.5
}
```

### Update THE Metrics
**PUT** `/api/admin/metrics/the`
```json
{
  "universityId": 1,
  "teaching": 85.5,
  "research": 90.0,
  "citations": 88.5,
  "internationalOutlook": 80.0
}
```

### Update QS Metrics
**PUT** `/api/admin/metrics/qs`
```json
{
  "universityId": 1,
  "academicReputation": 95.0,
  "employerReputation": 90.0,
  "facultyStudent": 85.0,
  "citationsPerFaculty": 88.0,
  "internationalFaculty": 80.0,
  "internationalStudents": 78.0
}
```

### Update ARWU Metrics
**PUT** `/api/admin/metrics/arwu`
```json
{
  "universityId": 1,
  "alumni": 95.0,
  "award": 92.5,
  "hici": 88.5,
  "ns": 85.0,
  "pub": 90.0,
  "pcp": 87.5
}
```

## Error Handling

The admin panel provides real-time feedback:

- **Green success message** - Operation completed successfully
- **Red error message** - Something went wrong (check console for details)
- **Info message** - Additional information about the operation

## Important Notes

### Constraints
- University names must be unique
- Each ranking provider can only have one entry per university
- Each university can only have one metrics entry per provider

### Data Validation
- Rankings must be between 1 and 100
- Overall scores must be between 45 and 99.5
- Metrics are scored 0-100 (optional fields)

### Cascading Deletes
When you delete a university:
- All rankings for that university are deleted
- All metrics for that university are deleted
- The deletion is permanent

## Example Workflow

### Add a New University to Database

1. **Add University**
   - Name: "University of Excellence"
   - Country: "Innovation Land"
   - Region: "Europe"

2. **Add Rankings**
   - THE Rank: 25, Score: 82.5
   - QS Rank: 30, Score: 80.0
   - ARWU Rank: 35, Score: 79.5

3. **Add Metrics**
   - THE: Teaching 85, Research 90, Citations 80, International 75
   - QS: Academic 90, Employer 85, Faculty 80, Citations 75, Intl Faculty 70, Intl Students 68
   - ARWU: Alumni 95, Award 85, HiCi 80, NS 75, Pub 88, PCP 82

## Troubleshooting

### "University name already exists"
Each university must have a unique name. Try renaming or check if it's already in the database.

### "Failed to create university"
Check that all required fields are filled and try again.

### "Invalid provider"
Make sure to select THE, QS, or ARWU only.

### Changes not appearing
Refresh the page to see updated data in the main rankings table.

## Best Practices

1. **Data Consistency** - Keep rankings and metrics aligned (high ranking = high scores)
2. **Regular Backups** - Consider backing up your database regularly
3. **Validation** - Double-check data before making changes
4. **Testing** - Test changes with a small dataset first

## Security Note

The admin panel is currently unrestricted. In a production environment, consider:
- Adding authentication/authorization
- Implementing audit logging
- Adding rate limiting
- Using environment variables for access control
