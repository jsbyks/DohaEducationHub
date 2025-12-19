# Google Maps & Facebook URLs Data Extraction Guide

This guide explains how to extract data from Google Maps and import URLs into your database.

## Files You Have

- **schools_clickable_google_maps.csv** - CSV with 433 schools and Google Maps URLs
- **schools_facebook_collection.csv** - Empty template for manual Facebook data collection

## Scripts Created

### 1. Google Places API Extractor (RECOMMENDED)
**File**: `backend/scripts/extract_google_maps_api.py`

**What it does**:
- Searches Google Places for each school
- Extracts: Phone, Website, Address, Coordinates, Ratings
- Updates database automatically
- Most reliable and accurate

**Requirements**:
- Google Places API key (FREE for 28,000 requests/month)
- More than enough for 433 schools

**How to get API key**:
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Places API" and "Maps JavaScript API"
4. Go to Credentials → Create Credentials → API Key
5. Copy your API key

**Usage**:
```bash
cd backend

# Option 1: Set environment variable
set GOOGLE_PLACES_API_KEY=your_api_key_here
.venv/Scripts/python.exe scripts/extract_google_maps_api.py

# Option 2: Enter when prompted
.venv/Scripts/python.exe scripts/extract_google_maps_api.py
# Then paste your API key when asked
```

---

### 2. Web Scraping Extractor (Alternative)
**File**: `backend/scripts/extract_google_maps_data.py`

**What it does**:
- Attempts to scrape data from Google Maps URLs
- No API key needed
- Less reliable (may be blocked by Google)

**Usage**:
```bash
cd backend
.venv/Scripts/python.exe scripts/extract_google_maps_data.py
```

**Limitations**:
- Google may block repeated requests
- Less accurate data extraction
- Slower than API method

---

### 3. Facebook URLs Importer
**File**: `backend/scripts/import_facebook_urls.py`

**What it does**:
- Imports Facebook URLs from a CSV file
- Matches schools by ID
- Updates facebook_url field in database

**Expected CSV format**:
```csv
ID,School Name,Facebook_URL
125,ABC School,https://www.facebook.com/abcschool
126,XYZ School,https://www.facebook.com/xyzschool
```

**Usage**:
```bash
cd backend
.venv/Scripts/python.exe scripts/import_facebook_urls.py
```

---

## Recommended Workflow

### Option A: Use Google Places API (Best Results)

1. **Get API Key** (5 minutes)
   - Follow steps above to get Google Places API key
   - It's free for up to 28,000 requests/month

2. **Run Extraction** (30-60 minutes for all schools)
   ```bash
   cd backend
   set GOOGLE_PLACES_API_KEY=your_key_here
   .venv/Scripts/python.exe scripts/extract_google_maps_api.py
   ```

3. **Review Results**
   - Script will show which schools were updated
   - Check database or frontend to verify data

4. **Import Facebook URLs** (if you have them)
   - Create CSV with format: ID,School Name,Facebook_URL
   - Run: `.venv/Scripts/python.exe scripts/import_facebook_urls.py`

### Option B: Web Scraping (No API Key)

1. **Try Web Scraping**
   ```bash
   cd backend
   .venv/Scripts/python.exe scripts/extract_google_maps_data.py
   ```

2. **Check Results**
   - May have limited success due to Google's blocking
   - Consider switching to API method if results are poor

3. **Manual Collection for Missing Data**
   - Use schools_facebook_collection.csv for remaining schools
   - Fill in data manually
   - Import with: `.venv/Scripts/python.exe scripts/import_facebook_data.py`

---

## What Data Will Be Extracted

From **Google Maps/Places**:
- ✓ Phone Number → `contact` field
- ✓ Website URL → `website` field
- ✓ Full Address → `address` field
- ✓ GPS Coordinates → `latitude`, `longitude` fields
- ✓ Ratings (if available)

From **Facebook URLs** (when provided):
- ✓ Facebook Page URL → `facebook_url` field

---

## Checking the Data

After extraction, check in database:
```bash
cd backend
.venv/Scripts/python.exe -c "from db import SessionLocal; from models import School; db = SessionLocal(); school = db.query(School).filter(School.id == 125).first(); print(f'Name: {school.name}'); print(f'Phone: {school.contact}'); print(f'Website: {school.website}'); print(f'Address: {school.address}'); print(f'Coords: {school.latitude}, {school.longitude}'); print(f'Facebook: {school.facebook_url}')"
```

Or check in your application frontend at: http://localhost:3000/schools/125

---

## Troubleshooting

### "API key required"
- Get API key from Google Cloud Console
- Enable Places API
- Set environment variable or enter when prompted

### "No schools updated"
- Check if schools already have data (script only updates empty fields)
- Verify CSV file path is correct
- Check API key permissions

### "Rate limit exceeded"
- Add longer delays between requests
- Split into batches
- Upgrade API quota (if needed)

### Web scraping blocked
- Switch to Google Places API method
- Use VPN or different IP
- Add longer delays between requests

---

## Cost & Limits

**Google Places API - FREE TIER**:
- 28,000 requests per month FREE
- Each school uses 2 requests (search + details) = 56,000 total requests needed for all schools
- This exceeds free tier, but only costs ~$0.017 per request after free tier
- Estimated cost: ~$1-2 for 433 schools (if you go over free tier)

**Alternative**: Run in batches over 2 months to stay within free tier

---

## Next Steps

1. **Choose your extraction method** (API recommended)
2. **Run the extraction script**
3. **Verify the data** in your application
4. **Import Facebook URLs** if you have them
5. **Manually fill** any remaining gaps using the CSV template

The data will be immediately available in your application after extraction!
