import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import db
from api import schools, auth, reviews, favorites, posts

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


# Allow CORS for the frontend development origin(s)
# In production, CORS_ORIGINS should be set to a comma-separated list of allowed origins.
# For example: CORS_ORIGINS=https://your-frontend.vercel.app,https://another-domain.com
cors_origins_env = os.getenv("CORS_ORIGINS")
origins = ["http://localhost:3000"]
if cors_origins_env:
    origins.extend(cors_origins_env.split(','))

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
