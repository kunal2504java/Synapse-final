from beanie import Document, Link
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Warehouse(Document):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    latitude: float
    longitude: float

    class Settings:
        name = "warehouses"

class DeliveryVehicle(Document):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    vehicle_id: str
    current_latitude: float
    current_longitude: float
    status: str

    class Settings:
        name = "delivery_vehicles"
        indexes = ["vehicle_id"] # Add index for faster lookups

class ShipmentEvent(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str
    location: str
    description: str

class Order(Document):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    customer_name: str
    order_date: datetime = Field(default_factory=datetime.utcnow)
    expected_delivery_date: datetime
    status: str
    total_price: float
    origin_warehouse: Link[Warehouse]
    destination_latitude: float
    destination_longitude: float
    assigned_vehicle: Optional[Link[DeliveryVehicle]] = None
    shipment_history: List[ShipmentEvent] = []

    class Settings:
        name = "orders"

class Anomaly(Document):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    anomaly_type: str
    description: str
    severity: str
    related_order: Optional[Link[Order]] = None
    related_vehicle: Optional[Link[DeliveryVehicle]] = None

    class Settings:
        name = "anomalies"
