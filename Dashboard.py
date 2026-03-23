from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from Medication import Medication, TimeOfDayEnum, FormEnum, FrequencyEnum
from MedicationCard import MedicationCard

app = FastAPI(title="Medication Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MedicationLog(BaseModel):
    medication_id: str
    medication_name: str
    taken_date: str
    taken_time: str
    status: str = "taken"

class DashboardResponse(BaseModel):
    date_display: str
    stats: Dict[str, Any]
    grouped_medications: Dict[str, List[Dict[str, Any]]]

# In-memory database simulating actual DB
db_medications = [
    Medication(id="1", name="Lisinopril", time_of_day=TimeOfDayEnum.morning, purpose="For high blood pressure", form=FormEnum.tablet, frequency=FrequencyEnum.once_daily),
    Medication(id="2", name="Multivitamin", time_of_day=TimeOfDayEnum.morning, purpose="General health", form=FormEnum.tablet, frequency=FrequencyEnum.once_daily),
    Medication(id="3", name="Metformin", time_of_day=TimeOfDayEnum.afternoon, purpose="For blood sugar", form=FormEnum.tablet, frequency=FrequencyEnum.twice_daily),
    Medication(id="4", name="Atorvastatin", time_of_day=TimeOfDayEnum.evening, purpose="For cholesterol", form=FormEnum.tablet, frequency=FrequencyEnum.once_daily),
]

db_logs: List[MedicationLog] = []

@app.get("/api/dashboard", response_model=DashboardResponse)
async def get_dashboard():
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    medications = db_medications
    logs = [log for log in db_logs if log.taken_date == today]
    taken_ids = {log.medication_id for log in logs}

    grouped = {"morning": [], "afternoon": [], "evening": []}
    for med in medications:
        time = med.time_of_day.value if med.time_of_day.value in grouped else "morning"
        
        is_taken = med.id in taken_ids
        card = MedicationCard(id=med.id, name=med.name, purpose=med.purpose, dosage=med.dosage, is_taken=is_taken)
        
        grouped[time].append({
            "medication": med,
            "is_taken": is_taken,
            "display_text": card.get_display_text(),
            "button_text": card.get_button_text()
        })

    total = len(medications)
    taken = len(taken_ids)
    progress = (taken / total * 100) if total > 0 else 0

    return DashboardResponse(
        date_display=now.strftime("Today, %A %b %d"),
        stats={"total": total, "taken": taken, "progress": progress},
        grouped_medications=grouped
    )

class TakeMedicationRequest(BaseModel):
    med_id: str

@app.post("/api/medications/log")
async def mark_medication_taken(request: TakeMedicationRequest):
    med_id = request.med_id
    med = next((m for m in db_medications if m.id == med_id), None)
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")

    now = datetime.now()
    log_entry = MedicationLog(
        medication_id=med_id,
        medication_name=med.name,
        taken_date=now.strftime("%Y-%m-%d"),
        taken_time=now.strftime("%H:%M"),
        status="taken"
    )
    if not any(log.medication_id == med_id and log.taken_date == log_entry.taken_date for log in db_logs):
        db_logs.append(log_entry)
        
    return {"message": "Success", "log": log_entry}

@app.post("/api/undo-medication/{med_id}")
async def undo_medication(med_id: str):
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    
    global db_logs
    original_len = len(db_logs)
    db_logs = [log for log in db_logs if not (log.medication_id == med_id and log.taken_date == today)]
    
    if len(db_logs) < original_len:
        return {"message": f"Medication {med_id} status reverted to pending", "status": "success"}
    else:
        raise HTTPException(status_code=404, detail="Medication log not found for today")

if __name__ == "__main__":
    import uvicorn
    # 포트를 8888로 변경하고 host를 0.0.0.0으로 개방
    uvicorn.run("Dashboard:app", host="0.0.0.0", port=8888, reload=True)