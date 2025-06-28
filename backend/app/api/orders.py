from fastapi import APIRouter, HTTPException, Query
import random
from datetime import datetime, timedelta
from typing import List, Optional
from uuid import UUID
from ..models.models import Order, Warehouse, DeliveryVehicle
from ..schemas.schemas import Order as OrderSchema, OrderJourney, OrderCreate

router = APIRouter()

@router.get("/orders", response_model=List[OrderSchema])
async def get_all_orders(
    skip: int = 0,
    limit: int = Query(default=10, le=100),
    status: Optional[str] = None
):
    """
    Retrieve a list of orders, with optional pagination and status filtering.
    """
    # Build the query dictionary based on provided filters
    find_query = {}
    if status:
        find_query["status"] = status
    
    orders = await Order.find(
        find_query,
        skip=skip,
        limit=limit,
        fetch_links=True  # This will automatically fetch linked documents
    ).to_list()
    
    return orders

@router.get("/orders/{order_id}", response_model=OrderSchema)
async def get_order_details(order_id: UUID):
    """
    Retrieve all details for a single order by its UUID.
    """
    order = await Order.get(order_id, fetch_links=True)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/orders/{order_id}/journey", response_model=OrderJourney)
async def get_order_journey(order_id: UUID):
    """
    Retrieve the full journey for a single order, including its details
    and assigned vehicle information.
    """
    order = await Order.get(order_id, fetch_links=True)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # The assigned_vehicle is already fetched thanks to fetch_links=True
    # The OrderJourney schema will structure the response correctly.
    return OrderJourney(order=order, vehicle=order.assigned_vehicle)

@router.post("/orders", response_model=OrderSchema)
async def create_order(order_data: OrderCreate):
    """
    Create a new order.
    """
    origin_warehouse = await Warehouse.get(order_data.origin_warehouse_id)
    if not origin_warehouse:
        raise HTTPException(status_code=404, detail="Origin warehouse not found")

    # Assign a random available vehicle for simplicity
    vehicles = await DeliveryVehicle.find(DeliveryVehicle.status == "Idle").to_list()
    if not vehicles:
        # Fallback to any vehicle if none are idle
        vehicles = await DeliveryVehicle.find_all().to_list()
        if not vehicles:
            raise HTTPException(status_code=503, detail="No delivery vehicles available")
    
    assigned_vehicle = random.choice(vehicles)

    new_order = Order(
        customer_name=order_data.customer_name,
        expected_delivery_date=datetime.utcnow() + timedelta(days=random.randint(2, 7)),
        status="Processing",
        total_price=order_data.total_price,
        origin_warehouse=origin_warehouse,
        destination_latitude=order_data.destination_latitude,
        destination_longitude=order_data.destination_longitude,
        assigned_vehicle=assigned_vehicle
    )
    await new_order.save()
    
    # Optionally, start its journey simulation in the background
    # asyncio.create_task(simulate_shipment_journey(new_order))
    
    return new_order
