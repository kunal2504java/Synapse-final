from fastapi import APIRouter
from typing import List
from ..models.models import Anomaly
from ..schemas.schemas import Anomaly as AnomalySchema

router = APIRouter()

@router.get("/anomalies", response_model=List[AnomalySchema])
async def get_recent_anomalies():
    """
    Retrieve the 5 most recent anomalies from the database, with linked documents.
    """
    anomalies = await Anomaly.find_all(
        sort=[("timestamp", -1)], 
        limit=5, 
        fetch_links=True
    ).to_list()
    
    return anomalies
