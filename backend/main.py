import os
import logging
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

# Logger for diagnostic messages
logger = logging.getLogger("doha_backend")


@app.on_event("startup")
def on_startup():
    # create local dev tables
    db.Base.metadata.create_all(bind=db.engine)


@app.get("/")
def root():
    return {"message": "Doha Education Hub API is running"}


# Configure CORS
# Start with a default list of allowed origins.
# In a non-production environment, this includes localhost for local development.
env = os.getenv("ENVIRONMENT", "development").lower()
origins = []
if env != "production":
    # Allow any localhost port for local development. Use an origin regex
    # so requests from any localhost port (e.g. 3000, 3001) are permitted.
    # Also add the common frontend ports explicitly for clarity in logs.
    origins.extend(["http://localhost:3000", "http://localhost:3001"])
    allow_origin_regex = r"^http://localhost(:[0-9]+)?$"

# Get CORS origins from the environment variable.
# The variable should be a comma-separated list of URLs.
cors_origins_env = os.getenv("CORS_ORIGINS")
if cors_origins_env:
    # Split the string by commas, strip whitespace from each URL, and filter out any empty strings.
    # This creates a clean list of origin URLs.
    additional_origins = [o.strip() for o in cors_origins_env.split(',') if o.strip()]
    # Add these to the list of allowed origins.
    origins.extend(additional_origins)

    # Safety: some deploy targets (e.g., Vercel) may be registered with or without
    # hyphens in the project name. Add common hyphenated/unhyphenated variants
    # for the Doha Education Hub frontend to avoid accidental CORS mismatches.
    def _add_variant(orig: str):
        try:
            from urllib.parse import urlparse

            p = urlparse(orig)
            host = p.netloc
            if 'dohaeducationhub' in host and 'doha-education-hub' not in host:
                variant = orig.replace('dohaeducationhub', 'doha-education-hub')
                origins.append(variant)
            if 'doha-education-hub' in host and 'dohaeducationhub' not in host:
                variant = orig.replace('doha-education-hub', 'dohaeducationhub')
                origins.append(variant)
        except Exception:
            pass

    for o in list(additional_origins):
        _add_variant(o)

# If in a production environment and the origins list is still empty,
# it means CORS_ORIGINS was not set. Log a clear warning.
if env == "production" and not origins:
    print("WARNING: The 'CORS_ORIGINS' environment variable is not set in the production environment.")
    print("No external origins will be allowed, which will likely cause CORS errors for the frontend.")

print(f"CORS allowed origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=(allow_origin_regex if 'allow_origin_regex' in globals() else None),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Fallback middleware: some deployment platforms (edge proxies or CDNs)
# may strip or alter CORS headers. As a defensive measure, after the
# response is generated ensure the Access-Control-Allow-Origin header is
# present for requests with an Origin header that matches our allowed list.
@app.middleware("http")
async def ensure_cors_header(request, call_next):
    response = await call_next(request)
    origin = request.headers.get("origin")
    try:
            # TEMPORARY: For immediate diagnosis and to unblock frontend in production,
            # set the `Access-Control-Allow-Origin` header to the request's Origin
            # when present, even if it isn't in `origins`. This is a short-lived
            # emergency measure and will be tightened after root cause is found.
            if origin:
                if "access-control-allow-origin" not in (k.lower() for k in response.headers.keys()):
                    response.headers["Access-Control-Allow-Origin"] = origin
                    response.headers["Access-Control-Allow-Credentials"] = "true"
                    # Diagnostic log to help confirm middleware execution in deployed logs
                    # Print and log a diagnostic message so it's visible in deployed logs
                    try:
                        print(f"CORS fallback applied: origin={origin} path={request.url.path}")
                    except Exception:
                        pass
                    try:
                        logger.warning("CORS fallback applied", extra={"origin": origin, "path": request.url.path})
                    except Exception:
                        pass
    except Exception:
        pass
    return response


# Diagnostic middleware: log request origin and final response headers for
# every request to help determine whether headers are being set or stripped
# further upstream. This is temporary and will be removed after verification.
@app.middleware("http")
async def log_request_and_response_headers(request, call_next):
    response = await call_next(request)
    try:
        origin = request.headers.get("origin")
        # Print a concise summary so logs remain readable
        print(f"REQ_LOG: method={request.method} path={request.url.path} origin={origin} response_headers={list(response.headers.keys())}")
    except Exception:
        pass
    return response


# Debug endpoint: only enabled in non-production environments to avoid exposing
# request headers in production. Useful for manual verification during testing.
if env != "production":
    from fastapi import Request

    @app.get("/debug/cors")
    async def debug_cors(request: Request):
        origin = request.headers.get("origin")
        return {
            "origin": origin,
            "allowed_origins": origins,
            "allow_origin_regex": (allow_origin_regex if 'allow_origin_regex' in globals() else None),
        }


# Temporary runtime config endpoint (exposed in production briefly for diagnostics)
@app.get("/debug/config")
async def debug_config():
    return {
        "env": env,
        "allowed_origins": origins,
        "allow_origin_regex": (allow_origin_regex if 'allow_origin_regex' in globals() else None),
    }

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
