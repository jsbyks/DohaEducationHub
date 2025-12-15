import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import db
from api import schools, auth, reviews, favorites, posts, teachers, bookings, payments
from api import test_helpers

app = FastAPI(
    title="Doha Education Hub API",
    description="API for searching and managing schools in Doha, Qatar",
    version="1.0.0",
)


@app.on_event("startup")
def on_startup():
    # create local dev tables
    db.Base.metadata.create_all(bind=db.engine)


@app.get("/")
def root():
    return {"message": "Doha Education Hub API is running"}


# Configure CORS origins based on environment.
# In development, allow the local frontend. In production, require explicit
# CORS_ORIGINS env var to avoid accidentally allowing localhost in production.
cors_origins_env = os.getenv("CORS_ORIGINS")
env = os.getenv("ENVIRONMENT", "development").lower()
if env == "production":
    origins = []
    if cors_origins_env:
        # split and strip whitespace
        origins = [o.strip() for o in cors_origins_env.split(',') if o.strip()]
    else:
        # Warn when deploying to production without explicit CORS origins
        print("WARNING: CORS_ORIGINS not set in production; no origins will be allowed until configured.")
else:
    origins = ["http://localhost:3000"]
    if cors_origins_env:
        origins.extend([o.strip() for o in cors_origins_env.split(',') if o.strip()])

print(f"CORS allowed origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schools.router, prefix="/api/schools", tags=["schools"])
app.include_router(auth.router)
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(favorites.router, prefix="/api/favorites", tags=["favorites"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["teachers"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])

# Test helpers router is always included; endpoints are guarded by ENABLE_TEST_ENDPOINTS
app.include_router(test_helpers.router)
