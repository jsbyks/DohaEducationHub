from fastapi import FastAPI
import db
from api import schools, auth

app = FastAPI(
    title="Doha Education Hub API",
    description="API for searching and managing schools in Doha, Qatar",
    version="1.0.0"
)


@app.on_event("startup")
def on_startup():
    # create local dev tables
    db.Base.metadata.create_all(bind=db.engine)


@app.get("/")
def root():
    return {"message": "Doha Education Hub API is running"}


app.include_router(schools.router, prefix="/api/schools", tags=["schools"])
app.include_router(auth.router) 
