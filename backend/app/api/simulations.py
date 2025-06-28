from fastapi import APIRouter
from ..schemas import schemas

router = APIRouter()

@router.post("/simulations", response_model=schemas.SimulationResponse)
async def run_simulation(request: schemas.SimulationRequest):
    """Accepts a simulation prompt and returns a mocked AI playbook."""
    prompt = request.prompt.lower()
    playbook = ""

    if "delay" in prompt or "supplier" in prompt:
        playbook = """
# Playbook: Supplier Delay

**Objective:** Mitigate the impact of a 24-hour supplier delay on downstream fulfillment.

### 1. Immediate Actions (0-2 Hours)
- **Alert Stakeholders:** Automatically notify inventory and logistics managers.
- **Inventory Check:** Cross-reference delayed components with current stock levels at nearby warehouses.
- **Customer Communication:** Flag potentially affected orders and draft proactive communication templates.

### 2. Rerouting & Reallocation (2-6 Hours)
- **Source from Alternate Hubs:** Identify warehouses with surplus stock and calculate optimal transfer routes.
- **Adjust Production Schedules:** Temporarily de-prioritize manufacturing that requires the delayed component.
- **Evaluate Air Freight Options:** For high-priority orders, assess cost vs. benefit of expedited shipping for the component.

### 3. Systemic Review (Post-Incident)
- **Update Supplier Scorecard:** Document incident to factor into future reliability ratings.
- **Review Safety Stock Levels:** Analyze if current safety stock policies are adequate for this supply line.
"""
    elif "weather" in prompt or "traffic" in prompt:
        playbook = """
# Playbook: Adverse Weather/Traffic Event

**Objective:** Proactively reroute in-transit shipments to avoid delays and ensure driver safety.

### 1. Real-time Monitoring & Alerts
- **Geofence Alert:** System automatically detects vehicles entering a high-risk weather or traffic zone.
- **Driver Notification:** Send automated alerts to driver terminals with recommended alternate routes.
- **ETA Recalculation:** Instantly update ETAs for all affected shipments and notify downstream customers.

### 2. Dynamic Rerouting Engine
- **Engage Alternate Routes:** The system calculates the top 3 alternative routes based on real-time traffic, distance, and toll costs.
- **Prioritize Sensitive Cargo:** Shipments with perishable or high-value goods are given priority for the fastest, safest routes.

### 3. Post-Event Analysis
- **Log Route Efficiency:** Record the time saved and additional mileage of the alternate route for future planning.
- **Carrier Performance:** Track how quickly carriers adapt to rerouting instructions.
"""
    else:
        playbook = """
# Playbook: General Disruption

**Objective:** Provide a generic, robust framework for handling unforeseen operational disruptions.

### 1. Assess
- **Identify:** What is the nature and scope of the disruption?
- **Impact Analysis:** Which orders, routes, and facilities are affected?

### 2. Communicate
- **Internal:** Alert relevant teams (Logistics, Customer Service, Warehouse Ops).
- **External:** Notify affected customers with transparent, updated information.

### 3. Act
- **Contingency Plans:** Activate pre-defined contingency plans for the specific type of disruption.
- **Manual Override:** Empower operational managers to make necessary manual adjustments.

### 4. Learn
- **Root Cause Analysis:** Conduct a post-mortem to understand the root cause.
- **Update Playbooks:** Refine or create new playbooks based on the event.
"""

    return schemas.SimulationResponse(playbook_markdown=playbook)
