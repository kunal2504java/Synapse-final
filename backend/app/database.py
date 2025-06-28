import os
import motor.motor_asyncio
from beanie import init_beanie
from dotenv import load_dotenv
from typing import List
from pydantic import BaseModel

# Import all your Beanie Document models here
from .models.models import Order, ShipmentEvent, DeliveryVehicle, Warehouse, Anomaly

load_dotenv()

class Settings(BaseModel):
    mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/synapse_db")
    database_name: str = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/synapse_db")).get_default_database().name

    class Config:
        env_file = ".env"

settings = Settings()

async def init_db():
    """
    Initializes the database connection and Beanie ODM.
    """
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongodb_uri, uuidRepresentation="standard")
    database = client[settings.database_name]

    await init_beanie(
        database=database,
        document_models=[
            Order,
            DeliveryVehicle,
            Warehouse,
            Anomaly
        ]
    )
