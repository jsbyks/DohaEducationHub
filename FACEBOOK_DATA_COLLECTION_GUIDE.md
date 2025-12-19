# Facebook Data Collection Guide

This guide explains how to manually collect Facebook information for all schools and import it into the database.

## Overview

We've set up a complete workflow for manually collecting Facebook contact details for all 433 schools in the database.

## Files Created

1. **schools_facebook_collection.csv** - CSV file with all schools for data collection
2. **backend/scripts/import_facebook_data.py** - Script to import collected data back into database
3. **backend/scripts/add_facebook_columns.py** - Script that added Facebook fields to database (already run)
4. **backend/scripts/generate_facebook_collection_csv.py** - Script that generated the CSV (already run)

## Workflow

### Step 1: Open the CSV File

Open `schools_facebook_collection.csv` in Excel, Google Sheets, or any spreadsheet editor.

The CSV contains:
- **Current Information**: ID, Name, Type, Curriculum, Address, Contact, Website, Status
- **Facebook Data Columns** (to be filled):
  - Facebook URL
  - Facebook Phone
  - Facebook Email
  - Facebook Address
  - Facebook About/Description
  - Facebook Verified (Yes/No)
  - Facebook Followers
  - Notes
  - Completed (Yes/No)

### Step 2: Collect Facebook Data

For each school:

1. Search for the school on Facebook (use school name + "Qatar")
2. Open the school's Facebook page
3. Fill in the available information:
   - **Facebook URL**: Copy the page URL
   - **Facebook Phone**: Phone number from "Contact Info"
   - **Facebook Email**: Email from "Contact Info"
   - **Facebook Address**: Address from "About" section
   - **Facebook About/Description**: Short description from "About"
   - **Facebook Verified**: "Yes" if the page has a blue checkmark, "No" otherwise
   - **Facebook Followers**: Number of followers/likes
   - **Notes**: Any additional observations
4. Mark the **Completed** column as **"Yes"** when done

**Tips:**
- You can work on schools in batches
- Save the CSV frequently
- If a school doesn't have a Facebook page, just mark it as completed with no data
- Use the Notes column for any issues or observations

### Step 3: Import the Data

After you've collected Facebook data for some or all schools:

```bash
cd backend
.venv/Scripts/python.exe scripts/import_facebook_data.py
```

The import script will:
- Only process rows marked as "Completed: Yes"
- Update the database with Facebook information
- Show a summary of updated schools
- Skip schools that haven't been completed yet

**You can run the import multiple times** as you complete more schools - it will only import newly completed entries.

### Step 4: Verify in the Application

After importing, the Facebook data will be available in:
- School detail pages
- API responses (GET /api/schools/{id})
- The frontend school view

## Database Fields Added

The following fields were added to both `schools` and `staging_schools` tables:

- `facebook_url` (VARCHAR 500)
- `facebook_phone` (VARCHAR 200)
- `facebook_email` (VARCHAR 200)
- `facebook_address` (TEXT)
- `facebook_about` (TEXT)
- `facebook_verified` (BOOLEAN)
- `facebook_followers` (INTEGER)

## API Schema Updated

The following API schemas now include Facebook fields:
- `SchoolBase`
- `SchoolCreate`
- `SchoolUpdate`
- `SchoolOut`

## Progress Tracking

To check your progress:
- Count the "Yes" entries in the "Completed" column
- Total schools: 433
- Track: X/433 completed

## Re-generating the CSV

If you need to regenerate the CSV (this will overwrite your current file):

```bash
cd backend
.venv/Scripts/python.exe scripts/generate_facebook_collection_csv.py
```

**Warning**: This will create a fresh CSV with no data filled in. Make sure to backup your work before regenerating!

## Notes

- The CSV format makes it easy to work collaboratively (Google Sheets)
- You can filter, sort, and organize the spreadsheet however you like
- The import script uses the ID column to match schools, so don't change that
- Empty fields are okay - the import will only update fields that have values
- The "Completed" column controls which rows get imported

## Need Help?

If you encounter any issues:
1. Check that the CSV file is in the root directory
2. Ensure you've marked schools as "Completed: Yes"
3. Verify the ID column matches database school IDs
4. Check for any error messages during import

## Example Workflow

1. Open `schools_facebook_collection.csv`
2. Start with first 10 schools
3. Search each on Facebook and fill in data
4. Mark each as "Completed: Yes"
5. Save the CSV
6. Run import script: `.venv/Scripts/python.exe scripts/import_facebook_data.py`
7. Verify updates in the application
8. Continue with next batch of schools

Good luck with the data collection!
