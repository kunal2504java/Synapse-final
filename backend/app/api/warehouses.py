from fastapi import APIRouter
from typing import List
from ..models.models import Warehouse
from ..schemas.schemas import Warehouse as WarehouseSchema

router = APIRouter()

@router.get("/warehouses", response_model=List[WarehouseSchema])
async def get_all_warehouses():
    """
    Retrieve a list of all warehouses.
    """
    warehouses = await Warehouse.find_all().to_list()
    return warehouses
