from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.bugs import router as bugs_router
from app.routes.analytics import router as analytics_router
from app.db import init_db

app = FastAPI(title="AI Bug Report Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(bugs_router)
app.include_router(analytics_router)


@app.get("/")
def home():
    return {"message": "AI Bug Report Assistant Backend Running"}
