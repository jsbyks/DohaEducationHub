# Schools Module - Implementation Requirements

Based on: MASTER DOHA SCHOOL HUB.md

**Last Updated:** December 16, 2025

---

## **Implementation Status Legend:**
- ✅ **Implemented** - Feature is complete and working
- ⚠️ **Partially Implemented** - Feature exists but needs enhancement
- ❌ **Not Implemented** - Feature needs to be built from scratch

---

## **1. ADVANCED SEARCH SYSTEM**

### **Search Filters**

| Filter | Status | Priority | Notes |
|--------|--------|----------|-------|
| **Location-based** | ✅ | High | Map view, distance radius, area/district (Al Dafna, West Bay, Al Waab, Education City) |
| **School Type** | ✅ | High | Kindergarten, Primary, Government, Private, International, Arabic Medium |
| **Curriculum** | ✅ | High | British, American, Indian (CBSE), IB (PYP), French, Canadian, Filipino |
| **Fee Range** | ✅ | High | QAR 15,000 - QAR 80,000+ per year |
| **Language of Instruction** | ⚠️ | High | English, Arabic, French, etc. - Need to add filter |
| **Religious Affiliation** | ⚠️ | Medium | Islamic studies required/optional, secular |
| **Special Features** | ⚠️ | High | See subsection below |
| **Transportation** | ⚠️ | Medium | School bus availability, routes |
| **Class Size** | ⚠️ | Medium | Student-teacher ratio filter |
| **Availability Status** | ⚠️ | High | Accepting new students, waiting list status |

### **Special Features Filters** (Currently Missing)
- ❌ SEN (Special Education Needs) support
- ❌ After-school programs
- ❌ STEM focus
- ❌ Arts programs
- ❌ Sports facilities

---

## **2. COMPREHENSIVE SCHOOL PROFILES**

### **A. Basic Details**

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| Official name and logo | ✅ | High | Complete |
| Full address with Google Maps | ✅ | High | Complete |
| Contact information | ✅ | High | Phone, email, website, social media |
| School timings | ⚠️ | Medium | Need to add to database schema |
| Academic calendar | ⚠️ | Medium | Need to add to database schema |
| Kahramaa (KM) number | ❌ | Low | Qatar-specific requirement |

### **B. Academic Information**

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| Curriculum details | ✅ | High | Complete |
| Grade levels offered | ⚠️ | High | Need detailed breakdown (KG1, KG2, Year 1-6) |
| Language of instruction | ⚠️ | High | Need to add to database |
| Ministry of Education approval | ❌ | Medium | Add certification status |
| Accreditation bodies | ❌ | Medium | International accreditations |

### **C. Financial Details**

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| Annual tuition fees by grade | ⚠️ | High | Currently single fee field - need breakdown |
| Registration fees | ❌ | High | One-time, non-refundable |
| Deposit requirements | ❌ | High | Refundable/non-refundable |
| Additional costs | ❌ | Medium | Uniforms, books, transport, exams |
| Payment terms | ❌ | Medium | Annual, termly, monthly options |
| Educational voucher acceptance | ❌ | High | QAR 28,000 for eligible students |
| Corporate discounts | ❌ | Medium | Available/not available |
| Sibling discounts | ❌ | Medium | Percentage or amount |

### **D. Facilities & Programs**

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| Campus facilities | ⚠️ | High | Library, labs, sports, cafeteria - need structured data |
| Technology integration | ❌ | Medium | iPads, smart boards, online portals |
| Extra-curricular activities | ⚠️ | High | Need categorized list |
| After-school care | ❌ | High | Availability and fees |
| Special education support | ❌ | High | SEN programs |
| Gifted and talented programs | ❌ | Medium | Advanced learning tracks |
| School counseling services | ❌ | Medium | Pastoral care |

### **E. Transportation**

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| School bus availability | ❌ | High | Yes/No/Optional |
| Transportation fees | ❌ | High | Typically QAR 1,376 per term |
| Route coverage | ❌ | Medium | Areas served |
| Safety measures | ❌ | Medium | Seat belts, GPS tracking, monitors |

### **F. Admission Process**

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| Entry requirements | ❌ | High | Academic prerequisites |
| Application deadlines | ❌ | High | Key dates |
| Assessment procedures | ❌ | High | Tests, interviews |
| Required documents | ❌ | High | Checklist |
| Enrollment steps | ❌ | Medium | Step-by-step guide |
| Age requirements | ❌ | High | e.g., KG minimum age: 3 years by March 31 |

### **G. Performance Data**

| Field | Status | Priority | Notes |
|-------|--------|----------|-------|
| Student-teacher ratio | ❌ | High | Important metric |
| Average class size | ❌ | High | Important metric |
| Ministry inspection ratings | ❌ | High | Official ratings |
| Academic achievements | ❌ | Medium | Awards, recognition |
| University placement rates | ❌ | Low | For schools with secondary |

### **H. Rich Media Content**

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Photo galleries | ⚠️ | High | Basic image upload exists - need gallery |
| Virtual tours (360°) | ❌ | Low | Future enhancement |
| Promotional videos | ❌ | Medium | YouTube/video embeds |
| Staff profiles | ❌ | Low | Teacher/admin bios |
| Principal's message | ❌ | Low | Welcome message |

---

## **3. COMPARISON TOOL**

### **Features Needed**

| Feature | Status | Priority | Implementation Notes |
|---------|--------|----------|---------------------|
| Compare up to 5 schools side-by-side | ❌ | High | Frontend comparison table |
| Visual comparison charts | ❌ | High | Bar charts, radar charts |
| Highlight differences | ❌ | Medium | Visual indicators |
| Filter by specific criteria | ❌ | Medium | Customizable comparison |
| Export comparison as PDF | ❌ | Medium | PDF generation library |
| Share comparison link | ❌ | Medium | URL state management |
| Save comparisons to account | ❌ | Low | Requires user authentication |

### **Comparison Categories**

- ❌ Fees breakdown
- ❌ Curriculum details
- ❌ Facilities comparison
- ❌ Location & accessibility
- ❌ Class sizes
- ❌ Extra-curricular programs
- ❌ Transportation options
- ❌ Admission requirements

---

## **4. INTERACTIVE MAP**

### **Map Features**

| Feature | Status | Priority | Implementation Notes |
|---------|--------|----------|---------------------|
| Google Maps integration | ⚠️ | High | Basic map exists - needs enhancement |
| School location markers | ✅ | High | Complete |
| Color coding by school type | ❌ | Medium | Different marker colors |
| Cluster view for dense areas | ❌ | Medium | Map clustering library |
| Draw distance radius tool | ❌ | High | Circle drawing on map |
| Traffic/commute time estimator | ❌ | Low | Google Maps API |
| Public transport accessibility | ❌ | Low | Transit layer |
| Nearby amenities | ❌ | Low | Hospitals, parks, shopping |
| Print/save map function | ❌ | Low | Map screenshot |

---

## **5. REVIEWS & RATINGS SYSTEM**

### **Core Features**

| Feature | Status | Priority | Implementation Notes |
|---------|--------|----------|---------------------|
| Overall rating (1-5 stars) | ❌ | High | Star rating component |
| Specific rating categories | ❌ | High | See categories below |
| Written reviews | ❌ | High | Text input with moderation |
| Parent verification | ❌ | High | Verify enrollment status |
| Helpful votes | ❌ | Medium | Upvote/downvote system |
| School response feature | ❌ | Medium | Allow schools to respond |
| Review moderation | ❌ | High | Admin approval system |
| Sort/filter reviews | ❌ | Medium | By date, rating, helpfulness |

### **Rating Categories**

- ❌ Academic quality
- ❌ Teaching staff quality
- ❌ Facilities quality
- ❌ Communication
- ❌ Value for money
- ❌ Extra-curricular activities
- ❌ Administration responsiveness

---

## **PRIORITY IMPLEMENTATION ROADMAP**

### **Phase 1: Critical Features (High Priority)**

1. **Enhanced Search Filters**
   - [ ] Language of instruction filter
   - [ ] Special features filters (SEN, STEM, Arts, Sports)
   - [ ] Transportation availability filter
   - [ ] Class size/student-teacher ratio filter
   - [ ] Availability status filter

2. **Financial Information**
   - [ ] Tuition fees by grade level
   - [ ] Registration fees
   - [ ] Deposit requirements
   - [ ] Educational voucher acceptance indicator
   - [ ] Additional costs breakdown

3. **School Comparison Tool**
   - [ ] Side-by-side comparison (up to 5 schools)
   - [ ] Visual comparison charts
   - [ ] Export to PDF functionality

4. **Reviews & Ratings**
   - [ ] Star rating system (overall + categories)
   - [ ] Written review submission
   - [ ] Review display and sorting
   - [ ] Moderation system

5. **Admission Information**
   - [ ] Entry requirements
   - [ ] Application deadlines
   - [ ] Required documents
   - [ ] Age requirements

### **Phase 2: Important Enhancements (Medium Priority)**

6. **Enhanced Map Features**
   - [ ] Color-coded markers by school type
   - [ ] Distance radius tool
   - [ ] Map clustering

7. **Facilities & Programs**
   - [ ] Structured facilities data
   - [ ] Extra-curricular activities list
   - [ ] After-school care information
   - [ ] SEN support details

8. **Transportation Details**
   - [ ] Bus availability
   - [ ] Transportation fees
   - [ ] Route coverage

9. **Performance Metrics**
   - [ ] Student-teacher ratio
   - [ ] Average class size
   - [ ] Ministry inspection ratings

10. **Media Galleries**
    - [ ] Photo gallery implementation
    - [ ] Video embed support

### **Phase 3: Future Enhancements (Lower Priority)**

11. **Rich Content**
    - [ ] Virtual 360° tours
    - [ ] Staff profiles
    - [ ] Principal's message

12. **Advanced Map Features**
    - [ ] Traffic/commute estimator
    - [ ] Public transport info
    - [ ] Nearby amenities

13. **Advanced Comparison**
    - [ ] Save comparisons to user account
    - [ ] Shareable comparison links

---

## **DATABASE SCHEMA UPDATES NEEDED**

### **New Fields for `schools` Table**

```sql
-- Academic Information
language_of_instruction TEXT[];
grade_levels_offered JSONB; -- {KG1: true, KG2: true, Year1: true, ...}
ministry_approval_status VARCHAR(50);
accreditation_bodies TEXT[];
academic_calendar JSONB;

-- Financial Details (detailed breakdown)
tuition_fees_by_grade JSONB; -- {KG1: 20000, KG2: 22000, ...}
registration_fee DECIMAL(10,2);
deposit_required DECIMAL(10,2);
deposit_refundable BOOLEAN;
additional_costs JSONB; -- {uniform: 500, books: 300, ...}
accepts_educational_voucher BOOLEAN;
corporate_discounts_available BOOLEAN;
sibling_discount_percentage INTEGER;

-- Facilities & Programs
facilities JSONB; -- {library: true, lab: true, sports: {...}}
technology_integration JSONB;
extracurricular_activities TEXT[];
afterschool_care BOOLEAN;
afterschool_care_fee DECIMAL(10,2);
sen_support BOOLEAN;
sen_programs JSONB;
gifted_programs BOOLEAN;
counseling_services BOOLEAN;

-- Transportation
bus_service_available BOOLEAN;
transportation_fee DECIMAL(10,2);
bus_routes TEXT[];
transportation_safety_features TEXT[];

-- Admission
entry_requirements TEXT;
application_deadline DATE;
assessment_procedures TEXT;
required_documents TEXT[];
minimum_age_requirements JSONB;

-- Performance
student_teacher_ratio VARCHAR(10); -- e.g., "15:1"
average_class_size INTEGER;
ministry_inspection_rating VARCHAR(50);
academic_achievements TEXT[];

-- Operational
school_timings VARCHAR(100); -- e.g., "7:30 AM - 2:30 PM"
kahramaa_number VARCHAR(50);

-- Status
accepting_new_students BOOLEAN;
has_waiting_list BOOLEAN;
```

### **New Table: `school_reviews`**

```sql
CREATE TABLE school_reviews (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id),
  user_id INTEGER REFERENCES users(id),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  academic_quality_rating INTEGER,
  teaching_staff_rating INTEGER,
  facilities_rating INTEGER,
  communication_rating INTEGER,
  value_for_money_rating INTEGER,
  extracurricular_rating INTEGER,
  administration_rating INTEGER,
  review_text TEXT,
  parent_verified BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  school_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **New Table: `school_comparisons`**

```sql
CREATE TABLE school_comparisons (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  school_ids INTEGER[],
  comparison_url_slug VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **New Table: `school_media`**

```sql
CREATE TABLE school_media (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id),
  media_type VARCHAR(20), -- photo, video, virtual_tour
  media_url TEXT,
  thumbnail_url TEXT,
  title VARCHAR(255),
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **TECHNICAL IMPLEMENTATION NOTES**

### **Frontend Components Needed**

1. **Search & Filters**
   - `AdvancedSearchFilters.tsx` - Enhanced filter component
   - `SchoolTypeFilter.tsx`
   - `SpecialFeaturesFilter.tsx`
   - `PriceRangeSlider.tsx`

2. **School Profile**
   - `SchoolFinancialDetails.tsx`
   - `SchoolFacilities.tsx`
   - `SchoolTransportation.tsx`
   - `AdmissionInformation.tsx`
   - `SchoolPerformanceMetrics.tsx`
   - `SchoolMediaGallery.tsx`

3. **Comparison Tool**
   - `SchoolComparison.tsx`
   - `ComparisonTable.tsx`
   - `ComparisonChart.tsx`
   - `ComparisonExport.tsx` - PDF export

4. **Reviews**
   - `ReviewsList.tsx`
   - `ReviewForm.tsx`
   - `StarRating.tsx`
   - `ReviewModeration.tsx` (admin)

5. **Map**
   - `EnhancedSchoolMap.tsx`
   - `MapFilters.tsx`
   - `RadiusDrawingTool.tsx`
   - `SchoolMarkerCluster.tsx`

### **Backend API Endpoints Needed**

```
GET    /api/schools/search - Enhanced search with all filters
GET    /api/schools/:id/details - Full school profile
GET    /api/schools/compare - Compare multiple schools
POST   /api/schools/:id/reviews - Submit review
GET    /api/schools/:id/reviews - Get school reviews
PUT    /api/reviews/:id/helpful - Vote review helpful
POST   /api/admin/reviews/:id/moderate - Approve/reject review
GET    /api/schools/:id/media - Get school media gallery
POST   /api/comparisons - Save comparison
GET    /api/comparisons/:slug - Get saved comparison
```

### **Libraries to Install**

```bash
# PDF Export
npm install jspdf jspdf-autotable

# Charts for comparison
npm install recharts

# Enhanced Maps
npm install @react-google-maps/api
npm install react-leaflet leaflet

# Image Gallery
npm install react-image-gallery
npm install react-photo-view

# Star Rating
npm install react-rating-stars-component

# URL State Management
npm install nuqs
```

---

## **NOTES & CONSIDERATIONS**

1. **Data Collection**: Much of the detailed school information will need to be collected through:
   - Manual data entry
   - School partnerships
   - Ministry of Education data
   - Web scraping (where legally permitted)

2. **Verification**: Reviews and ratings need strict verification to maintain credibility

3. **Legal**: Ensure compliance with Qatar's data protection laws

4. **Performance**: With 300+ schools, implement proper pagination, caching, and database indexing

5. **Mobile**: All features must be mobile-responsive

6. **SEO**: School profiles should be SEO-optimized for Qatar school searches

---

**End of Document**
