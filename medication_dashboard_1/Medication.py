from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl

class FormEnum(str, Enum):
    tablet = "tablet"
    capsule = "capsule"
    liquid = "liquid"
    injection = "injection"
    patch = "patch"
    other = "other"

class FrequencyEnum(str, Enum):
    once_daily = "once_daily"
    twice_daily = "twice_daily"
    three_times_daily = "three_times_daily"
    as_needed = "as_needed"

class TimeOfDayEnum(str, Enum):
    morning = "morning"
    afternoon = "afternoon"
    evening = "evening"

class Medication(BaseModel):
    name: str = Field(..., description="Name of the medication")
    time_of_day: TimeOfDayEnum = Field(..., description="When to take the medication")
    
    dosage: Optional[str] = Field(None, description="Dosage amount e.g. 500mg")
    form: FormEnum = Field(default=FormEnum.tablet, description="Form of the medication")
    purpose: Optional[str] = Field(None, description="What the medication is for")
    instructions: Optional[str] = Field(None, description="How to take the medication e.g. with food")
    pill_image_url: Optional[HttpUrl] = Field(None, description="URL to an image of the pill")
    frequency: FrequencyEnum = Field(default=FrequencyEnum.once_daily)
    active: bool = Field(default=True)
