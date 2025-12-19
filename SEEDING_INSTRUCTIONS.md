# School Seeding Instructions

## New Schools Added

The following **real Doha schools** have been added with comprehensive data:

### 1. **GEMS American Academy Qatar (GAAQ)**
- **Location:** Al Wakra
- **Curriculum:** American (K-12)
- **Fees:** QAR 38,000 - 52,000
- **Established:** 2014
- **Features:** Full facilities, swimming pool, STEM programs, SEN support

### 2. **DPS Modern Indian School**
- **Location:** Abu Hamour
- **Curriculum:** CBSE (Indian)
- **Fees:** QAR 12,500 - 20,000
- **Established:** 2003
- **Features:** 3,500 students, strong academics, competitive fees

### 3. **Lebanese School Doha**
- **Location:** Al Hilal
- **Curriculum:** French
- **Fees:** QAR 18,000 - 30,000
- **Established:** 1976
- **Features:** Trilingual (French, Arabic, English), established community

### 4. **Cedars International School**
- **Location:** Al Sadd
- **Curriculum:** IB (PYP)
- **Fees:** QAR 42,000 - 50,000
- **Established:** 2009
- **Features:** Outstanding rating, small class sizes (10:1 ratio), IB accredited

### 5. **Al Khor International School**
- **Location:** Al Khor
- **Curriculum:** British (Cambridge)
- **Fees:** QAR 28,000 - 44,000
- **Established:** 2008
- **Features:** Serves Al Khor region, full K-13, transportation to Ras Laffan

---

## How to Seed the Schools

### **Step 1: Apply Database Migrations**

First, make sure the enhanced schema is applied:

```bash
cd C:\Users\Admin\DohaEducationHub\backend

# Run migrations to add new columns
alembic upgrade head
```

This will create:
- 50+ new fields in the `schools` table
- `school_reviews` table
- `review_helpful_votes` table

### **Step 2: Run the Comprehensive Seed Script**

```bash
# From backend directory
python scripts/seed_comprehensive_schools.py
```

**Expected Output:**
```
[INFO] Starting comprehensive school seed...

[INFO] Found 59 existing schools in database
[ADD] GEMS American Academy Qatar
[ADD] DPS Modern Indian School
[ADD] Lebanese School Doha
[ADD] Cedars International School
[ADD] Al Khor International School

[SUCCESS] Added 5 new schools
[INFO] Skipped 0 duplicate schools
[INFO] Total schools in database: 64

[SUCCESS] Seed complete!
```

### **Step 3: Verify the Data**

```bash
# Access Python shell
python

# Run this to verify
from db import SessionLocal
from models import School

db = SessionLocal()

# Check new schools
new_schools = db.query(School).filter(
    School.name.in_([
        'GEMS American Academy Qatar',
        'DPS Modern Indian School',
        'Lebanese School Doha',
        'Cedars International School',
        'Al Khor International School'
    ])
).all()

for school in new_schools:
    print(f"{school.name}: {school.curriculum} - {school.area}")

# Check enhanced fields
school = db.query(School).filter(School.name == 'GEMS American Academy Qatar').first()
print(f"\nFacilities: {school.facilities}")
print(f"Fees by grade: {school.tuition_fees_by_grade}")
print(f"Languages: {school.language_of_instruction}")
```

---

## Data Included for Each School

✅ **Basic Information**
- Name, slug, type, description
- Full address, area, coordinates
- Contact details, email, website
- School timings, established year

✅ **Academic Details**
- Curriculum type
- Languages of instruction
- Grade levels offered (JSONB object)
- Ministry approval status
- Accreditation bodies (array)
- Religious affiliation

✅ **Complete Financial Breakdown**
- Tuition fees by grade level (JSONB)
- Registration fee (refundable/non-refundable)
- Deposit required (refundable/non-refundable)
- Additional costs (uniform, books, activities)
- Payment terms available
- Educational voucher acceptance
- Sibling discount percentage

✅ **Facilities & Programs**
- Campus facilities (15 types as JSONB)
- Technology integration details
- Extra-curricular activities list
- After-school care (with fees and timings)
- SEN support programs
- Gifted programs
- Counseling services

✅ **Transportation**
- Bus service availability
- Transportation fees
- Routes covered
- Safety features

✅ **Admission Information**
- Entry requirements
- Application deadlines
- Assessment procedures
- Required documents
- Age requirements by grade

✅ **Performance Metrics**
- Student-teacher ratio
- Average class size
- Ministry inspection rating
- Total students and staff

✅ **Status**
- Accepting new students
- Waiting list status
- Application status

---

## Troubleshooting

### If migrations fail:

```bash
# Check migration status
alembic current

# If stuck, try revision
alembic revision --autogenerate -m "your_message"

# Then upgrade
alembic upgrade head
```

### If duplicate key errors occur:

The script automatically checks for existing schools and skips them. If you see duplicates, check the school names in the database:

```sql
SELECT name FROM schools ORDER BY name;
```

### If JSONB errors occur:

Make sure your PostgreSQL version supports JSONB (9.4+):

```sql
SELECT version();
```

---

## Adding More Schools

To add more schools:

1. **Copy the template** from `backend/scripts/school_seed_template.json`
2. **Research real school data** from official websites
3. **Add to the COMPREHENSIVE_SCHOOLS list** in `seed_comprehensive_schools.py`
4. **Run the script** again - it will skip existing schools

### Example Template:

```python
{
    "name": "School Name",
    "slug": "school-name",
    "type": "International",
    "curriculum": "British",
    "description": "Description here...",
    "address": "Full address",
    "area": "Area name from DOHA_AREAS",
    "latitude": 25.xxxx,
    "longitude": 51.xxxx,
    "contact": "+974 xxxx xxxx",
    "email": "info@school.qa",
    "website": "https://school.qa",

    # Add all other fields from template...
}
```

### Reference Global Properties:

Use constants from `backend/config/school_properties.py`:
- `CURRICULUM_TYPES` - for curriculum field
- `DOHA_AREAS` - for area field
- `FACILITIES` - for facilities keys
- `EXTRACURRICULAR_ACTIVITIES` - for activities list

---

## Next Steps

After seeding:

1. ✅ **Test the schools page** - Visit `/schools` in the frontend
2. ✅ **Check school details** - Click on a new school
3. ✅ **Integrate new components** - Add the 3 new components to school detail pages
4. ✅ **Test search filters** - Try filtering by curriculum, area, fees
5. ✅ **Add more schools** - Keep building the database!

---

## Data Sources for Research

When adding more schools, use:
- Official school websites
- Ministry of Education Qatar (edu.gov.qa)
- School social media pages
- Parent review sites
- Direct calls to admission offices

**Important:** Always verify fee information as it changes annually!

---

**Last Updated:** December 16, 2025
