import asyncio
import random
from datetime import datetime, timedelta
import uuid

from app.database import init_db
from app.models.models import Warehouse, DeliveryVehicle, Order, ShipmentEvent, Anomaly

# --- Configuration ---
NUM_WAREHOUSES = 3
NUM_VEHICLES = 10
SIMULATION_TICK_SECONDS = 5  # Time between new orders

# --- Mock Data ---
CUSTOMER_NAMES = ["Priya Sharma", "Rohan Gupta", "Ananya Singh", "Vikram Kumar", "Sneha Patel", "Arjun Reddy", "Aisha Khan", "Sameer Joshi"]
LOCATIONS = {
    "Mumbai": (19.0760, 72.8777),
    "Delhi": (28.7041, 77.1025),
    "Bangalore": (12.9716, 77.5946),
    "Chennai": (13.0827, 80.2707),
    "Kolkata": (22.5726, 88.3639),
    "Hyderabad": (17.3850, 78.4867),
    "Pune": (18.5204, 73.8567),
    "Ahmedabad": (23.0225, 72.5714)
}
VEHICLE_STATUSES = ["Idle", "In Transit", "Maintenance"]
ORDER_STATUSES = ["Processing", "Shipped", "In Transit", "Delivered"]
ANOMALY_TYPES = ["Delay", "Damage", "Lost Shipment"]
SEVERITY_LEVELS = ["Low", "Medium", "High"]

async def clear_collections():
    """Deletes all documents from the relevant collections."""
    print("Clearing existing data...")
    await Order.delete_all()
    await DeliveryVehicle.delete_all()
    await Warehouse.delete_all()
    await Anomaly.delete_all()
    print("Data cleared.")

async def create_initial_data():
    """Creates the initial set of warehouses and delivery vehicles."""
    print("Creating initial warehouses and vehicles...")
    warehouses = []
    for i in range(NUM_WAREHOUSES):
        loc_name, (lat, lon) = random.choice(list(LOCATIONS.items()))
        warehouse = Warehouse(name=f"Warehouse {loc_name} #{i+1}", latitude=lat, longitude=lon)
        warehouses.append(warehouse)
    await Warehouse.insert_many(warehouses)

    vehicles = []
    for i in range(NUM_VEHICLES):
        loc_name, (lat, lon) = random.choice(list(LOCATIONS.items()))
        vehicle = DeliveryVehicle(
            vehicle_id=f"SYN-V-{random.randint(100, 999)}",
            current_latitude=lat,
            current_longitude=lon,
            status=random.choice(VEHICLE_STATUSES)
        )
        vehicles.append(vehicle)
    await DeliveryVehicle.insert_many(vehicles)
    print(f"{len(warehouses)} warehouses and {len(vehicles)} vehicles created.")
    return warehouses, vehicles

async def simulate_shipment_journey(order: Order):
    """Simulates the shipment events for a given order."""
    journey_events = [
        ("Processing", "Order received and is being processed at the warehouse."),
        ("Shipped", "Order has been dispatched from the warehouse."),
        ("In Transit", "Order is on its way to the destination."),
        ("Delivered", "Order has been successfully delivered to the customer.")
    ]

    for i, (status, desc) in enumerate(journey_events):
        await asyncio.sleep(random.uniform(1, 3)) # Simulate time between events
        event_time = order.order_date + timedelta(minutes=i * 15)
        event = ShipmentEvent(
            timestamp=event_time,
            status=status,
            location=order.origin_warehouse.name,
            description=desc
        )
        order.shipment_history.append(event)
        order.status = status
        await order.save()
        print(f"  [Event] Order {order.id} status updated to: {status}")

async def generate_random_anomaly(orders, vehicles):
    """Occasionally generates a random anomaly."""
    if random.random() < 0.2: # 20% chance of an anomaly
        anomaly_type = random.choice(ANOMALY_TYPES)
        related_order = random.choice(orders)
        related_vehicle = random.choice(vehicles)
        anomaly = Anomaly(
            anomaly_type=anomaly_type,
            description=f"{anomaly_type} detected for order {related_order.id}.",
            severity=random.choice(SEVERITY_LEVELS),
            related_order=related_order,
            related_vehicle=related_vehicle
        )
        await anomaly.save()
        print(f"!!! [Anomaly Created] Type: {anomaly_type}, Severity: {anomaly.severity} !!!")

async def main():
    """Main simulation loop."""
    print("--- Starting Synapse Data Simulation ---")
    await init_db()
    await clear_collections()
    warehouses, vehicles = await create_initial_data()

    print("\n--- Running Simulation Loop (Press Ctrl+C to stop) ---")
    order_count = 0
    while True:
        order_count += 1
        # Create a new order
        origin_warehouse = random.choice(warehouses)
        assigned_vehicle = random.choice(vehicles)
        dest_loc, (dest_lat, dest_lon) = random.choice(list(LOCATIONS.items()))

        new_order = Order(
            customer_name=random.choice(CUSTOMER_NAMES),
            expected_delivery_date=datetime.utcnow() + timedelta(days=random.randint(2, 7)),
            status="Pending",
            total_price=round(random.uniform(20.0, 500.0), 2),
            origin_warehouse=origin_warehouse,
            destination_latitude=dest_lat,
            destination_longitude=dest_lon,
            assigned_vehicle=assigned_vehicle
        )
        await new_order.save()
        print(f"\n[Order Created #{order_count}] ID: {new_order.id} for {new_order.customer_name}")

        # Start its journey in the background
        asyncio.create_task(simulate_shipment_journey(new_order))

        # Potentially create an anomaly
        await generate_random_anomaly([new_order], vehicles)

        # Wait for the next tick
        await asyncio.sleep(SIMULATION_TICK_SECONDS)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n--- Simulation stopped by user. ---")