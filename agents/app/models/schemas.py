from pydantic import BaseModel, Field
from typing import List, Optional

class DisruptionSignal(BaseModel):
    supplier_name: Optional[str] = "GlobalTech"
    document_text: str
    date: Optional[str] = None

class ClassificationResult(BaseModel):
    crisis_id: str
    disruption_type: str
    severity: str
    affected_parts: List[str]
    lat: Optional[float] = None
    lng: Optional[float] = None
    location_name: Optional[str] = None
    crisis_type: Optional[str] = "SUPPLY_CHAIN_DISRUPTION"
    workflow: Optional[str] = "procurement"
    affected_systems: Optional[List[str]] = None
    allowed_agents: Optional[List[str]] = None

class FinancialImpact(BaseModel):
    crisis_id: str
    estimated_delay_days: int
    daily_loss_usd: int
    total_impact_usd: int

class AlternativeSupplier(BaseModel):
    name: str
    country: str
    cost_increase_percentage: float
    delivery_time_days: int
    lat: Optional[float] = None
    lng: Optional[float] = None

class ComplianceResult(BaseModel):
    supplier_name: str
    is_compliant: bool
    esg_score: int
    sanctions_clear: bool
    notes: str
    xai_report: dict = Field(default_factory=dict, description="Explainable AI justification for the final decision.")

class RemediationExecution(BaseModel):
    crisis_id: str
    chosen_supplier: str
    action_taken: str
    status: str
    rpa_logs: Optional[List[str]] = None

