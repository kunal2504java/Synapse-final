from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.api import kpis, anomalies, orders, simulations, warehouses, vehicles

# The database and models will be used later
# from .database import engine, Base

app = FastAPI(
    title="Synapse - The Self-Healing Retail Nervous System",
    description="API for managing and visualizing a retail supply chain.",
    version="1.0.0",
)

@app.on_event("startup")
async def on_startup():
    """Initialize the database when the application starts."""
    await init_db()

# Configure CORS to allow the frontend to access the API
# In production, you should restrict this to your actual frontend domain
origins = [
    "http://localhost",
    "http://localhost:3000", # Default Create React App port
    "http://localhost:5173", # Default Vite dev server port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for health check
@app.get("/")
def read_root():
    return {"message": "Welcome to the Synapse API"}

# Include the API routers
app.include_router(kpis.router, prefix="/api/v1", tags=["KPIs"])
app.include_router(anomalies.router, prefix="/api/v1", tags=["Anomalies"])
app.include_router(orders.router, prefix="/api/v1", tags=["Orders"])
app.include_router(simulations.router, prefix="/api/v1", tags=["Simulations"])
app.include_router(warehouses.router, prefix="/api/v1", tags=["Warehouses"])
app.include_router(vehicles.router, prefix="/api/v1", tags=["Vehicles"])
