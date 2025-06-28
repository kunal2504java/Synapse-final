from fastapi import APIRouter
from ..schemas.schemas import KPI
from ..models.models import Order, Anomaly

router = APIRouter()

@router.get("/kpis", response_model=KPI)
async def get_kpis():
    """
    Retrieve key performance indicators by querying the database.
    """
    total_orders_count = await Order.count()
    
    # Calculate on-time delivery percentage
    on_time_count = 0
    delivered_orders = await Order.find(Order.status == "Delivered").to_list()
    total_delivered = len(delivered_orders)

    for order in delivered_orders:
        # Find the "Delivered" event in the shipment history
        delivery_event = next((event for event in order.shipment_history if event.status == "Delivered"), None)
        if delivery_event and delivery_event.timestamp <= order.expected_delivery_date:
            on_time_count += 1
            
    on_time_percentage = (on_time_count / total_delivered) * 100 if total_delivered > 0 else 100.0

    active_anomalies_count = await Anomaly.count()

    # NOTE: Carbon footprint calculation is not implemented and returns a mock value.
    # This would require a more complex model involving vehicle type, distance, etc.
    mock_carbon_footprint = (total_orders_count * 0.275) # A mock calculation

    return KPI(
        total_orders=total_orders_count,
        on_time_deliveries_percent=round(on_time_percentage, 2),
        active_anomalies=active_anomalies_count,
        overall_carbon_footprint_kg=round(mock_carbon_footprint, 2)
    )
