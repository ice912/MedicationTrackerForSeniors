from enum import Enum
from datetime import date
from typing import Optional
from pydantic import BaseModel, HttpUrl

class RecordType(str, Enum):
    HOSPITAL_RECORD = "hospital_record"
    LAB_RESULT = "lab_result"
    PRESCRIPTION = "prescription"
    IMAGING = "imaging"
    OTHER = "other"

class MedicalRecord(BaseModel):
    title: str
    record_type: RecordType = RecordType.OTHER
    file_url: Optional[HttpUrl] = None
    provider_name: Optional[str] = None
    record_date: Optional[date] = None
    notes: Optional[str] = None