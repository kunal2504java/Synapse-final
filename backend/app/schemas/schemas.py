from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Pydantic models (schemas) for API input and output.
# These are aligned with the Beanie Document models.

class ConfigBase:
    from_attributes = True

# --- Base Schemas (for creation) ---

class WarehouseBase(BaseModel):
    name: str
    latitude: float
    longitude: float

class DeliveryVehicleBase(BaseModel):
    vehicle_id: str
    current_latitude: float
    current_longitude: float
    status: str

class OrderBase(BaseModel):
    customer_name: str
    expected_delivery_date: datetime
    status: str
    total_price: float
    destination_latitude: float
    destination_longitude: float

class AnomalyBase(BaseModel):
    anomaly_type: str
    description: str
    severity: str

# --- Full Schemas (for API responses) ---

class ShipmentEvent(BaseModel):
    """ This is a nested Pydantic model, not a Beanie Document. """
    timestamp: datetime
    status: str
    location: str
    description: str

class Warehouse(WarehouseBase):
    id: uuid.UUID
    class Config(ConfigBase): pass

class DeliveryVehicle(DeliveryVehicleBase):
    id: uuid.UUID
    class Config(ConfigBase): pass

class Order(OrderBase):
    id: uuid.UUID
    order_date: datetime
    origin_warehouse: Warehouse
    assigned_vehicle: Optional[DeliveryVehicle] = None
    shipment_history: List[ShipmentEvent] = []
    class Config(ConfigBase): pass

class Anomaly(AnomalyBase):
    id: uuid.UUID
    timestamp: datetime
    related_order: Optional[Order] = None
    related_vehicle: Optional[DeliveryVehicle] = None
    class Config(ConfigBase): pass

# --- Schemas for Specific API Endpoints ---

class KPI(BaseModel):
    total_orders: int
    on_time_deliveries_percent: float
    active_anomalies: int
    overall_carbon_footprint_kg: float

class OrderJourney(BaseModel):
    order: Order
    vehicle: Optional[DeliveryVehicle] = None

class OrderCreate(BaseModel):
    customer_name: str
    total_price: float
    origin_warehouse_id: uuid.UUID
    destination_latitude: float
    destination_longitude: float

class SimulationRequest(BaseModel):
    prompt: str

class SimulationResponse(BaseModel):
    playbook_markdown: str
