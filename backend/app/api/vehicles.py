from fastapi import APIRouter, HTTPException
from typing import List
from app.models.models import DeliveryVehicle
from app.schemas.schemas import DeliveryVehicle as DeliveryVehicleSchema

router = APIRouter()

@router.get("/vehicles", response_model=List[DeliveryVehicleSchema])
async def get_all_vehicles():
    """
    Retrieve all delivery vehicles from the database.
    """
    try:
        vehicles = await DeliveryVehicle.find_all().to_list()
        return vehicles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
