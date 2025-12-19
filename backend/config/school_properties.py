"""
Global School Properties Configuration
Reusable constants and options for school data across the platform
"""

# Curriculum Types
CURRICULUM_TYPES = [
    "British",
    "American",
    "Indian (CBSE)",
    "IB (PYP)",
    "IB (MYP)",
    "IB (DP)",
    "French",
    "Canadian",
    "Filipino",
    "Qatari National",
    "Arabic",
    "Other"
]

# Languages of Instruction
LANGUAGES_OF_INSTRUCTION = [
    "English",
    "Arabic",
    "French",
    "Urdu",
    "Hindi",
    "Filipino",
    "Bilingual (English/Arabic)",
    "Multilingual"
]

# School Types
SCHOOL_TYPES = [
    "Kindergarten",
    "Primary",
    "Secondary",
    "Kindergarten & Primary",
    "Primary & Secondary",
    "All Through (KG-12)",
    "Government",
    "Private",
    "International",
    "Arabic Medium"
]

# Grade Levels
GRADE_LEVELS = {
    "KG1": "Kindergarten 1 (Age 3-4)",
    "KG2": "Kindergarten 2 (Age 4-5)",
    "Year 1": "Year 1 / Grade 1 (Age 5-6)",
    "Year 2": "Year 2 / Grade 2 (Age 6-7)",
    "Year 3": "Year 3 / Grade 3 (Age 7-8)",
    "Year 4": "Year 4 / Grade 4 (Age 8-9)",
    "Year 5": "Year 5 / Grade 5 (Age 9-10)",
    "Year 6": "Year 6 / Grade 6 (Age 10-11)",
    "Year 7": "Year 7 / Grade 7 (Age 11-12)",
    "Year 8": "Year 8 / Grade 8 (Age 12-13)",
    "Year 9": "Year 9 / Grade 9 (Age 13-14)",
    "Year 10": "Year 10 / Grade 10 (Age 14-15)",
    "Year 11": "Year 11 / Grade 11 (Age 15-16)",
    "Year 12": "Year 12 / Grade 12 (Age 16-17)",
    "Year 13": "Year 13 / Grade 13 (Age 17-18)"
}

# Religious Affiliations
RELIGIOUS_AFFILIATIONS = [
    "Islamic Studies Required",
    "Islamic Studies Optional",
    "Secular",
    "Catholic",
    "Christian (Non-denominational)",
    "Multi-faith"
]

# Facilities
FACILITIES = {
    "library": "Library",
    "science_lab": "Science Laboratory",
    "computer_lab": "Computer Laboratory",
    "sports_hall": "Indoor Sports Hall",
    "swimming_pool": "Swimming Pool",
    "football_field": "Football Field",
    "basketball_court": "Basketball Court",
    "playground": "Outdoor Playground",
    "cafeteria": "Cafeteria/Canteen",
    "auditorium": "Auditorium/Theater",
    "music_room": "Music Room",
    "art_studio": "Art Studio",
    "prayer_room": "Prayer Room",
    "medical_room": "Medical/First Aid Room",
    "counseling_room": "Counseling Room"
}

# Technology Integration
TECHNOLOGY_FEATURES = {
    "smart_boards": "Interactive Smart Boards",
    "ipads_tablets": "iPads/Tablets for Students",
    "student_portal": "Online Student Portal",
    "parent_app": "Parent Communication App",
    "digital_library": "Digital Library Access",
    "coding_classes": "Coding/Programming Classes",
    "robotics": "Robotics Program",
    "wifi": "Campus-wide WiFi",
    "computer_ratio": "1:1 Computer to Student Ratio"
}

# Extra-Curricular Activities
EXTRACURRICULAR_ACTIVITIES = [
    "Football/Soccer",
    "Basketball",
    "Swimming",
    "Athletics/Track & Field",
    "Tennis",
    "Martial Arts",
    "Dance",
    "Drama/Theater",
    "Music (Instrumental)",
    "Choir/Singing",
    "Art & Crafts",
    "Debate Club",
    "Science Club",
    "Robotics Club",
    "Chess Club",
    "Language Clubs",
    "Community Service",
    "Student Council",
    "Yearbook/Newspaper"
]

# Special Education Needs (SEN) Programs
SEN_PROGRAMS = {
    "learning_support": "Learning Support Program",
    "dyslexia": "Dyslexia Support",
    "autism": "Autism Spectrum Support",
    "adhd": "ADHD Support",
    "speech_therapy": "Speech & Language Therapy",
    "occupational_therapy": "Occupational Therapy",
    "eal_support": "English as Additional Language (EAL)",
    "gifted_talented": "Gifted & Talented Program"
}

# Transportation Safety Features
TRANSPORTATION_SAFETY = [
    "Seat Belts in All Buses",
    "GPS Tracking",
    "Bus Monitors/Supervisors",
    "CCTV Cameras",
    "First Aid Kit",
    "Fire Extinguisher",
    "Emergency Exits",
    "Parent Tracking App"
]

# Ministry Inspection Ratings
INSPECTION_RATINGS = [
    "Outstanding",
    "Very Good",
    "Good",
    "Satisfactory",
    "Unsatisfactory",
    "Not Yet Inspected"
]

# Application Status
APPLICATION_STATUS = [
    "Accepting Applications",
    "Limited Spaces",
    "Waiting List",
    "Applications Closed",
    "Opening Soon"
]

# Doha Areas/Districts
DOHA_AREAS = [
    "West Bay",
    "Al Dafna",
    "Al Waab",
    "Education City",
    "Al Sadd",
    "Al Rayyan",
    "Al Wakrah",
    "Lusail",
    "The Pearl Qatar",
    "Al Aziziyah",
    "Ain Khaled",
    "Umm Salal",
    "Al Khor",
    "Mesaieed",
    "Al Thumama",
    "Gharrafa",
    "Madinat Khalifa",
    "Old Airport Area",
    "Musheireb",
    "Diplomatic Area"
]

# Fee Ranges (in QAR per year)
FEE_RANGES = [
    {"min": 0, "max": 15000, "label": "Under QAR 15,000"},
    {"min": 15000, "max": 25000, "label": "QAR 15,000 - 25,000"},
    {"min": 25000, "max": 35000, "label": "QAR 25,000 - 35,000"},
    {"min": 35000, "max": 45000, "label": "QAR 35,000 - 45,000"},
    {"min": 45000, "max": 60000, "label": "QAR 45,000 - 60,000"},
    {"min": 60000, "max": 80000, "label": "QAR 60,000 - 80,000"},
    {"min": 80000, "max": 999999, "label": "Above QAR 80,000"}
]

# Payment Terms
PAYMENT_TERMS = [
    "Annual (One Payment)",
    "Termly (Three Payments)",
    "Monthly (10 Payments)",
    "Flexible Payment Plans Available"
]

# Required Documents for Admission
REQUIRED_DOCUMENTS = [
    "Birth Certificate (Original + Copy)",
    "Passport Copy (Student)",
    "Qatar ID Copy (Student)",
    "Passport Copy (Parents)",
    "Qatar ID Copy (Parents)",
    "Recent Passport Photos",
    "Previous School Report/Transcript",
    "Immunization Records",
    "Medical Certificate",
    "Proof of Residence (Utility Bill/Lease)",
    "Kahramaa Bill",
    "Transfer Certificate (if applicable)"
]

# School Timings Templates
SCHOOL_TIMINGS = {
    "standard": "7:30 AM - 2:30 PM",
    "early": "7:00 AM - 2:00 PM",
    "late": "8:00 AM - 3:00 PM",
    "split_shift_morning": "7:00 AM - 12:30 PM",
    "split_shift_afternoon": "12:30 PM - 6:00 PM"
}

# Academic Calendar Events
ACADEMIC_CALENDAR_TEMPLATE = {
    "academic_year_start": "September",
    "academic_year_end": "June",
    "term_1": {"start": "September", "end": "December"},
    "term_2": {"start": "January", "end": "March"},
    "term_3": {"start": "April", "end": "June"},
    "winter_break": "2 weeks in December",
    "spring_break": "2 weeks in March/April",
    "summer_break": "July - August",
    "national_holidays": [
        "Qatar National Day (December 18)",
        "Eid Al-Fitr",
        "Eid Al-Adha",
        "National Sport Day (February)"
    ]
}

# Age Requirements Template
AGE_REQUIREMENTS_TEMPLATE = {
    "KG1": {"minimum_age": 3, "cutoff_date": "March 31"},
    "KG2": {"minimum_age": 4, "cutoff_date": "March 31"},
    "Year 1": {"minimum_age": 5, "cutoff_date": "March 31"},
    "Year 2": {"minimum_age": 6, "cutoff_date": "March 31"}
}

# Accreditation Bodies
ACCREDITATION_BODIES = [
    "Ministry of Education and Higher Education (MOEHE) Qatar",
    "Council of International Schools (CIS)",
    "New England Association of Schools and Colleges (NEASC)",
    "Western Association of Schools and Colleges (WASC)",
    "British Schools Overseas (BSO)",
    "International Baccalaureate Organization (IBO)",
    "Cambridge International Examinations (CIE)",
    "Edexcel",
    "Council of British International Schools (COBIS)",
    "National Curriculum Board (NCB) India",
    "AdvancED/Cognia"
]

# Default Values for Optional Features
DEFAULT_OPTIONAL_FEATURES = {
    "afterschool_care": False,
    "sen_support": False,
    "gifted_programs": False,
    "counseling_services": False,
    "bus_service_available": False,
    "accepts_educational_voucher": False,
    "corporate_discounts_available": False,
    "accepting_new_students": True,
    "has_waiting_list": False
}
