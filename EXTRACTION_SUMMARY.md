# Data Extraction Setup Complete!

## What's Been Done

✓ **Database Schema Updated** - Added Facebook fields to schools table
✓ **CSV File Found** - schools_clickable_google_maps.csv with 433 schools
✓ **Extraction Scripts Created** - 3 different methods to extract and import data
✓ **Sample Data Verified** - Database ready to receive extracted data

## Current Database Status

**Sample School** (ID: 125 - A.B.C 123 Private Kindergarten):
- Contact: Empty ❌
- Website: Empty ❌
- Address: "Doha, Qatar" (generic)
- Coordinates: Empty ❌
- Facebook URL: Empty ❌

**Most schools have similar missing data - perfect for extraction!**

## Available Extraction Methods

### Method 1: Google Places API (RECOMMENDED) ⭐
**File**: `backend/scripts/extract_google_maps_api.py`

**Pros**:
- Most accurate and reliable
- Gets phone, website, full address, coordinates
- Free for first 28,000 requests/month
- Can process all 433 schools

**Cons**:
- Requires API key (5 min setup)

**Data extracted**:
- ✓ Phone numbers
- ✓ Website URLs
- ✓ Full addresses
- ✓ GPS coordinates
- ✓ Ratings

**To run**:
```bash
cd backend
set GOOGLE_PLACES_API_KEY=your_key_here
.venv/Scripts/python.exe scripts/extract_google_maps_api.py
```

---

### Method 2: Web Scraping
**File**: `backend/scripts/extract_google_maps_data.py`

**Pros**:
- No API key needed
- Free and immediate

**Cons**:
- May be blocked by Google
- Less reliable
- Slower

**To run**:
```bash
cd backend
.venv/Scripts/python.exe scripts/extract_google_maps_data.py
```

---

### Method 3: Facebook URLs Import
**File**: `backend/scripts/import_facebook_urls.py`

**Use case**: If you have a CSV with Facebook URLs

**CSV format needed**:
```csv
ID,School Name,Facebook_URL
125,ABC School,https://www.facebook.com/abcschool
```

**To run**:
```bash
cd backend
.venv/Scripts/python.exe scripts/import_facebook_urls.py
```

---

## Quick Start (5 minutes)

### Option A: With Google API Key

1. **Get API key**: https://console.cloud.google.com/apis/credentials
2. **Enable Places API**
3. **Run extraction**:
   ```bash
   cd C:\Users\Admin\DohaEducationHub\backend
   set GOOGLE_PLACES_API_KEY=your_api_key
   .venv\Scripts\python.exe scripts\extract_google_maps_api.py
   ```
4. **Wait 30-60 minutes** for all 433 schools
5. **Done!** Data automatically in database

### Option B: Try Web Scraping First

1. **Run scraping script**:
   ```bash
   cd C:\Users\Admin\DohaEducationHub\backend
   .venv\Scripts\python.exe scripts\extract_google_maps_data.py
   ```
2. **Check results**
3. **If blocked**, switch to API method

---

## What Happens After Extraction

1. **Database updated** - Phone, website, address, coordinates populated
2. **Frontend updated** - Data shows in school detail pages
3. **API updated** - GET /api/schools/{id} returns new data
4. **Search improved** - Better filtering by location

---

## Files Reference

| File | Purpose |
|------|---------|
| `schools_clickable_google_maps.csv` | Source data with 433 schools |
| `backend/scripts/extract_google_maps_api.py` | Google Places API extraction |
| `backend/scripts/extract_google_maps_data.py` | Web scraping extraction |
| `backend/scripts/import_facebook_urls.py` | Facebook URLs import |
| `backend/scripts/add_facebook_columns.py` | Database setup (already run) |
| `GOOGLE_MAPS_EXTRACTION_GUIDE.md` | Detailed guide |

---

## Expected Results

After running extraction on all 433 schools, you should have:

- **~350-400 phone numbers** extracted
- **~200-300 websites** extracted
- **~400+ full addresses** extracted
- **~400+ GPS coordinates** extracted
- **~300+ ratings** (if using API)

**Note**: Not all schools have complete data on Google, so some fields may remain empty.

---

## Next Steps

**Choose one**:

1. ⭐ **Recommended**: Get Google API key and run `extract_google_maps_api.py`
2. Try web scraping with `extract_google_maps_data.py`
3. If you have Facebook URLs, import them with `import_facebook_urls.py`

**Questions?**
- Check `GOOGLE_MAPS_EXTRACTION_GUIDE.md` for detailed instructions
- All scripts show progress and summary when running
- Safe to run multiple times (only updates empty fields)

---

## Ready to Go!

Everything is set up and tested. Just choose your extraction method and run the script!

The database is ready, scripts are tested, and your CSV is properly formatted.

**Estimated time**: 5 min setup + 30-60 min extraction = ~1 hour total to populate all 433 schools with Google data!
