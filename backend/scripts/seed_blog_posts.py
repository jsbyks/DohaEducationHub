"""
Seed script to populate the database with blog posts about education in Doha
"""
import sys
import os
from datetime import datetime, timedelta
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
import models

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def generate_slug(title: str) -> str:
    """Convert title to URL-friendly slug"""
    return title.lower().replace(' ', '-').replace(':', '').replace('?', '').replace('!', '').replace(',', '')

posts_data = [
    {
        "title": "Choosing the Right Curriculum for Your Child in Qatar",
        "excerpt": "A comprehensive guide to understanding the different curricula available in Doha's international schools - from British and American to IB and more.",
        "content": """# Choosing the Right Curriculum for Your Child in Qatar

When moving to Doha or selecting a school for your child, one of the most important decisions you'll face is choosing the right curriculum. Qatar offers a diverse range of international curricula, each with its own strengths and approach to education.

## Popular Curricula in Doha

### British Curriculum (IGCSE/A-Levels)
The British curriculum is one of the most common in Doha, offering structured learning with clear benchmarks. Students take IGCSEs at age 16 and A-Levels at 18.

**Pros:**
- Well-established and recognized globally
- Strong emphasis on core subjects
- Clear progression pathways

**Cons:**
- Heavy focus on exams
- Less flexibility in subject choices initially

### American Curriculum
The American system offers broad-based education with more subject flexibility. Students graduate with a High School Diploma and typically take SATs or ACTs for university admission.

**Pros:**
- Flexible course selection
- Holistic approach to education
- Strong extra-curricular programs

**Cons:**
- Can vary between schools
- Less structured than British system

### International Baccalaureate (IB)
The IB offers the Primary Years Programme (PYP), Middle Years Programme (MYP), and Diploma Programme (DP). It's known for its inquiry-based, international approach.

**Pros:**
- Encourages critical thinking
- Internationally recognized
- Balanced curriculum

**Cons:**
- Can be intensive, especially the DP
- Requires strong time management

### Other Curricula
Doha also offers French (Baccalauréat), Indian (CBSE), and Arabic (Ministry of Education) curricula, serving specific communities.

## Factors to Consider

1. **Future Plans**: Where do you plan to move next? What university systems are you targeting?
2. **Child's Learning Style**: Does your child thrive with structure or prefer flexibility?
3. **Language**: Some curricula are bilingual or offered in specific languages
4. **Cost**: Fees vary significantly between schools and curricula
5. **School Culture**: Beyond curriculum, consider the school's values and community

## Making the Decision

Visit multiple schools, speak with current parents, and most importantly, involve your child in the decision. The "best" curriculum is the one that best fits your child's needs, learning style, and future goals.

*For personalized advice, consider booking a consultation with our education specialists.*
""",
        "status": "published",
        "published_days_ago": 5
    },
    {
        "title": "Understanding School Fees in Doha: What to Expect",
        "excerpt": "A practical guide to navigating school fees in Qatar, including hidden costs, payment plans, and budgeting tips for expat families.",
        "content": """# Understanding School Fees in Doha: What to Expect

Education in Doha's international schools is a significant investment. Understanding the full cost structure helps families budget effectively and avoid surprises.

## Typical Fee Structure

### Annual Tuition
- **Indian Curriculum**: QAR 7,000 - 15,000
- **British Curriculum**: QAR 35,000 - 65,000
- **American Curriculum**: QAR 45,000 - 70,000
- **IB Programme**: QAR 40,000 - 65,000
- **French Curriculum**: QAR 35,000 - 50,000

Note: Fees typically increase with grade level.

## Additional Costs

### Registration & Admission
- Application Fee: QAR 500 - 1,500
- Registration/Capital Fee: QAR 2,000 - 10,000 (often one-time or annual)
- Assessment Fee: QAR 200 - 500

### Recurring Costs
- **Uniforms**: QAR 500 - 1,500 per year
- **Books & Materials**: QAR 1,000 - 3,000
- **School Bus**: QAR 6,000 - 10,000 per year
- **Lunch Program**: QAR 3,000 - 6,000 per year
- **Extra-curricular Activities**: QAR 1,000 - 5,000

### Optional Costs
- Music lessons, sports coaching, after-school programs
- School trips and educational visits
- Exam fees (IGCSE, IB, etc.)

## Payment Plans

Most schools offer:
- Annual payment (sometimes with a discount)
- Termly payments (3 installments)
- Monthly payments

## Money-Saving Tips

1. **Sibling Discounts**: Many schools offer 5-10% discounts for multiple children
2. **Early Payment**: Some schools offer discounts for annual payment
3. **Company Sponsorship**: Check if your employer offers education allowances
4. **Second-Hand Uniforms**: Join school parent groups for uniform swaps
5. **Bus Sharing**: Organize carpools with neighbors

## Financial Planning

Budget for:
- First year costs (including deposits and setup)
- Annual increases (typically 3-5%)
- Unexpected costs (trips, special events)
- Examination years (higher costs for Years 11-13)

## Scholarship Opportunities

Some schools offer:
- Merit-based scholarships
- Need-based financial aid
- Sports or arts scholarships
- Sibling scholarships

## Questions to Ask Schools

1. What's included in the tuition?
2. Are there any mandatory additional fees?
3. What's your fee increase policy?
4. Do you offer payment plans?
5. What's your refund policy if we leave mid-year?

*Understanding the full cost helps you make an informed decision and budget appropriately for your child's education in Doha.*
""",
        "status": "published",
        "published_days_ago": 12
    },
    {
        "title": "Preparing Your Child for School in Qatar: A New Expat's Guide",
        "excerpt": "Moving to Qatar? Here's everything you need to know about preparing your child for their new school, from cultural adaptation to practical tips.",
        "content": """# Preparing Your Child for School in Qatar: A New Expat's Guide

Moving to a new country is exciting but can be challenging for children. Here's how to prepare your child for their educational journey in Qatar.

## Before You Arrive

### Research & School Selection
- Start research 6-12 months before moving
- Create a shortlist of 3-5 schools
- Consider waitlists (popular schools fill quickly)
- Join expat forums for insider insights

### Documentation Needed
- Birth certificate (attested)
- Previous school records and transcripts
- Immunization records
- Passport copies
- Residence permit (RP) - apply upon arrival
- Transfer certificate from current school

### Language Preparation
If your child will study in a new language:
- Start basic language lessons
- Watch shows/read books in that language
- Find language exchange partners

## Cultural Preparation

### Discuss Qatar's Culture
- Islamic traditions and holidays
- Dress codes (modest dress)
- Social customs and etiquette
- Weekend is Friday-Saturday

### Climate Adjustment
- Explain the hot weather (40°C+ in summer)
- Most activities are indoors in summer
- Schools have excellent AC

## First Week Tips

### Help Them Settle In
- Arrive early the first few days
- Pack familiar items in their bag
- Arrange playdates with new classmates
- Join school parent groups

### Routine Establishment
- Set consistent bedtimes
- Prepare school items the night before
- Create a homework space
- Build in transition time

## Common Challenges & Solutions

### Homesickness
- Keep in touch with old friends via video calls
- Create new traditions
- Explore Qatar together as a family
- Give them time - adjustment takes 3-6 months

### Academic Differences
- Different curriculum might mean gaps or overlaps
- Communicate with teachers about transitions
- Consider tutoring for challenging subjects
- Celebrate small victories

### Making Friends
- Encourage participation in activities
- Arrange weekend meetups
- Join community sports or arts programs
- Be patient - friendships develop over time

## Practical Tips

### School Routine in Qatar
- School typically runs 7:30 AM - 2:30 PM (varies)
- Thursday-Friday weekend
- Islamic holidays affect the calendar
- Ramadan means shorter school days

### Transportation
- School buses are common and safe
- Traffic can be heavy - allow extra time
- Many families carpool

### Extra-curricular Activities
Qatar offers excellent facilities:
- Sports complexes (Aspire Zone)
- Music and arts programs
- Community centers
- Youth clubs

## Support Resources

- School counselors
- Expat parent groups
- Educational consultants
- Online expat forums

## Red Flags to Watch For

Seek help if your child shows:
- Persistent anxiety or sadness
- Declining grades
- Social withdrawal
- Physical symptoms (headaches, stomach aches)

## Making It Work

Remember:
- Every child adapts at their own pace
- Maintain open communication
- Celebrate cultural diversity
- Stay positive - children mirror your attitude

*With preparation and support, your child will thrive in their new Qatar school!*
""",
        "status": "published",
        "published_days_ago": 18
    },
    {
        "title": "Top 10 International Schools in Doha 2025",
        "excerpt": "Our comprehensive ranking of Doha's top international schools based on academic excellence, facilities, and parent satisfaction.",
        "content": """# Top 10 International Schools in Doha 2025

Based on academic performance, facilities, parent reviews, and overall value, here are our top picks for international schools in Doha.

## 1. Qatar Academy Doha (QAD)

**Curriculum:** IB (PYP, MYP, DP)
**Fees:** Free for Qatari citizens; competitive for expats

QAD, part of Qatar Foundation's education initiatives, offers world-class IB education with exceptional facilities in Education City.

**Strengths:**
- Outstanding facilities
- Strong IB results
- Diverse community
- Innovation focus

## 2. American School of Doha (ASD)

**Curriculum:** American with AP options
**Fees:** QAR 48,000 - 68,000

ASD is Qatar's oldest international school with a strong reputation and excellent university placement record.

**Strengths:**
- Established reputation (60+ years)
- Strong university counseling
- Excellent sports programs
- Active parent community

## 3. Doha College

**Curriculum:** British (IGCSE, A-Levels)
**Fees:** QAR 45,000 - 65,000

Doha College offers traditional British education with consistently strong examination results.

**Strengths:**
- Strong academic results
- Wide subject choices at A-Level
- Good pastoral care
- Active extra-curricular program

## 4. Compass International School

**Curriculum:** IB (PYP, MYP, DP)
**Fees:** QAR 42,000 - 64,000

Compass brings innovative, student-centered IB education with a focus on STEAM.

**Strengths:**
- Modern teaching approaches
- STEAM focus
- Strong community feel
- Impressive facilities

## 5. SEK International School

**Curriculum:** IB (PYP, MYP, DP)
**Fees:** QAR 44,000 - 62,000

SEK offers bilingual education (English/Spanish) with strong IB results and excellent sports facilities.

**Strengths:**
- Bilingual program
- Olympic-standard facilities
- International community
- Arts emphasis

## 6. Doha English Speaking School (DESS)

**Curriculum:** British (IGCSE, A-Levels)
**Fees:** QAR 43,000 - 61,000

DESS combines academic rigor with pastoral care in a supportive community environment.

**Strengths:**
- Caring atmosphere
- Strong teaching staff
- Good results
- Active parent association

## 7. Qatar International School (QIS)

**Curriculum:** IB (PYP, MYP, DP)
**Fees:** QAR 40,000 - 58,000

QIS offers solid IB education with a focus on developing well-rounded students.

**Strengths:**
- Balanced curriculum
- Good teacher-student ratio
- Strong values focus
- Affordable IB option

## 8. Newton International School

**Curriculum:** British (IGCSE, A-Levels)
**Fees:** QAR 36,000 - 54,000

Newton provides quality British education at competitive fees with a strong community spirit.

**Strengths:**
- Good value for money
- Caring environment
- Consistent results
- Growing reputation

## 9. Park House English School

**Curriculum:** British (Primary only)
**Fees:** QAR 39,000 - 44,000

Park House specializes in primary education with excellent early years provision.

**Strengths:**
- Excellent early years
- Small class sizes
- Individual attention
- Strong foundations

## 10. Birla Public School

**Curriculum:** Indian (CBSE)
**Fees:** QAR 8,000 - 15,000

Birla offers quality Indian curriculum education at accessible fees for the Indian community.

**Strengths:**
- Affordable fees
- Strong CBSE results
- Large Indian community
- Good facilities

## Selection Criteria

We evaluated schools based on:
- Academic results and university placement
- Facilities and resources
- Teacher quality and retention
- Parent satisfaction
- Extra-curricular programs
- Value for money
- School culture and community

## Important Notes

- Rankings reflect overall quality but individual fit matters most
- Visit schools personally before deciding
- Consider waitlists - popular schools fill early
- Fees increase with grade level

*Remember: The "best" school is the one that best fits your child's needs and your family's values.*
""",
        "status": "published",
        "published_days_ago": 25
    },
    {
        "title": "The Truth About School Waitlists in Doha",
        "excerpt": "Insider tips on navigating waitlists at Qatar's most popular international schools and increasing your chances of admission.",
        "content": """# The Truth About School Waitlists in Doha

Waitlists are a common reality for popular international schools in Doha. Here's what you need to know to navigate them successfully.

## Why Waitlists Happen

1. **Limited Capacity**: Schools have physical space constraints
2. **Maintaining Standards**: Optimal class sizes for quality education
3. **High Demand**: More families moving to Qatar than spaces available
4. **Sibling Priority**: Existing families get first priority
5. **Balanced Classes**: Schools aim for curriculum and age balance

## Schools with Longest Waitlists

Typically longest waits (sometimes 1-2 years):
- American School of Doha
- Doha College
- Qatar Academy Doha
- DESS (certain year groups)

## Understanding Priority

Most schools prioritize:
1. **Siblings** of current students
2. **Returning families** (previously attended)
3. **Company sponsors** (for certain schools)
4. **Application date** (first-come, first-served)
5. **Age/year group needs**

## Strategies to Improve Your Chances

### Apply Early
- Start 12-18 months before needed start date
- Apply before moving to Qatar if possible
- Don't wait for housing to be finalized

### Apply to Multiple Schools
- Have 3-5 school applications active
- Include a safety school (shorter waitlist)
- Don't put all eggs in one basket

### Stay Engaged
- Respond promptly to school communications
- Update contact information
- Attend open days if invited
- Show genuine interest

### Be Flexible
- Consider alternative entry points
- Year 3 and Year 7 often have more turnover
- Starting mid-year might be easier

### Network
- Join expat forums and groups
- Connect with current school parents
- Attend community events
- Professional networking can help

## What NOT to Do

- ❌ Don't offer bribes or special gifts
- ❌ Don't harass admissions staff
- ❌ Don't exaggerate child's abilities
- ❌ Don't badmouth other schools
- ❌ Don't assume connections guarantee admission

## Alternative Approaches

### Start at a Feeder School
Some schools have preferential admission from certain nurseries or primary schools.

### Consider Lesser-Known Quality Schools
Hidden gems with shorter waitlists:
- The Cambridge School
- Gulf English School
- Qatar International School

### Temporary Placement
- Accept place at available school
- Keep name on preferred school waitlist
- Transfer when spot opens

## Managing Expectations

### Realistic Timeline
- Popular schools: 6-24 months wait
- Mid-tier schools: 3-6 months wait
- Newer/less popular: Immediate admission possible

### Be Prepared to Wait
- Don't delay other plans
- Arrange interim schooling
- Keep options open

## Questions to Ask About Waitlists

1. What's my current position?
2. How many typically move off the waitlist yearly?
3. What factors affect my position?
4. Can I improve my chances?
5. Should I apply for multiple year groups?

## If You Get Off the Waitlist

### Act Quickly
- You'll typically have 24-48 hours to decide
- Deposit may be required immediately
- Spot goes to next family if you decline

### Be Decisive
- Know your budget
- Have documents ready
- Don't overthink - you applied for a reason

## Red Flags

Be cautious if a school:
- Requests money to "move up" the list
- Can't explain their waitlist process
- Gives inconsistent information
- Pressures you to withdraw other applications

## The Reality

- Waitlists are frustrating but manageable
- Many families get their preferred school eventually
- Some discover they prefer their "backup" choice
- Your child will thrive in the right environment, even if it wasn't your first choice

*Patience, flexibility, and multiple options are key to navigating Doha's school waitlists successfully.*
""",
        "status": "published",
        "published_days_ago": 30
    }
]

def seed_blog_posts():
    db: Session = SessionLocal()
    try:
        # Get or create admin user for author
        admin = db.query(models.User).filter(models.User.is_admin == True).first()
        if not admin:
            print("[INFO] No admin user found. Creating one for blog posts...")
            admin = models.User(
                email="admin@dohaeducationhub.com",
                full_name="Doha Education Hub Admin",
                hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5SupWdMyW6Yv2",  # "password"
                is_admin=True,
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # Check if posts already exist
        existing_count = db.query(models.Post).count()
        if existing_count > 0:
            print(f"[SKIP] Database already has {existing_count} blog posts. Skipping seed.")
            print("To re-seed, delete existing posts first.")
            return

        print("[SEED] Seeding blog posts...")

        for post_data in posts_data:
            published_at = datetime.now() - timedelta(days=post_data["published_days_ago"])

            post = models.Post(
                title=post_data["title"],
                slug=generate_slug(post_data["title"]),
                content=post_data["content"],
                excerpt=post_data["excerpt"],
                author_id=admin.id,
                status=post_data["status"],
                published_at=published_at if post_data["status"] == "published" else None
            )
            db.add(post)
            print(f"  [+] Added: {post.title}")

        db.commit()
        print(f"\n[SUCCESS] Successfully seeded {len(posts_data)} blog posts!")
        print("\nBlog posts published:")
        for post_data in posts_data:
            days_ago = post_data["published_days_ago"]
            print(f"  - {post_data['title'][:60]}... ({days_ago} days ago)")

    except Exception as e:
        print(f"[ERROR] Error seeding blog posts: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_blog_posts()
