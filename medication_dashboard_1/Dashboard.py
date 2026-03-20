from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

app = FastAPI(title="Medication Management API")

# --- 1. 스키마 정의 (Data Models) ---

class Medication(BaseModel):
    id: str
    name: str
    time_of_day: str  # morning, afternoon, evening
    active: bool = True

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

# --- 2. 가상 데이터베이스/SDK 연동 (Base44 대체) ---
# 실제 환경에서는 base44 SDK나 DB 세션을 여기서 호출합니다.

async def get_medications_from_db() -> List[Medication]:
    # 예시 데이터 반환 (React의 base44.entities.Medication.filter 역할)
    return [
        Medication(id="1", name="혈압약", time_of_day="morning"),
        Medication(id="2", name="비타민", time_of_day="afternoon"),
    ]

async def get_logs_from_db(date: str) -> List[MedicationLog]:
    # 예시 로그 데이터 반환
    return []

# --- 3. API 엔드포인트 (Controllers) ---

@app.get("/api/dashboard", response_model=DashboardResponse)
async def get_dashboard():
    """
    React의 Dashboard 컴포넌트에서 필요한 모든 데이터를 한 번에 가공하여 반환
    """
    today = datetime.now().strftime("%Y-%m-%d")
    
    # 1. 데이터 가져오기 (Parallel fetching 시뮬레이션)
    medications = await get_medications_from_db()
    logs = await get_logs_from_db(today)

    # 2. 로직 처리 (React의 useMemo 부분)
    taken_ids = {log.medication_id for log in logs}
    
    grouped = {"morning": [], "afternoon": [], "evening": []}
    for med in medications:
        time = med.time_of_day if med.time_of_day in grouped else "morning"
        grouped[time].append({
            "medication": med,
            "is_taken": med.id in taken_ids
        })

    # 3. 통계 계산
    total = len(medications)
    taken = len([m for m in medications if m.id in taken_ids])
    progress = (taken / total * 100) if total > 0 else 0

    return {
        "date_display": datetime.now().strftime("%A, %b %d"),
        "stats": {
            "total": total,
            "taken": taken,
            "progress": progress
        },
        "grouped_medications": grouped
    }

@app.post("/api/medications/log")
async def mark_medication_taken(med_id: str, med_name: str):
    """
    React의 markTakenMutation에 대응하는 엔드포인트
    """
    now = datetime.now()
    log_entry = MedicationLog(
        medication_id=med_id,
        medication_name=med_name,
        taken_date=now.strftime("%Y-%m-%d"),
        taken_time=now.strftime("%H:%M"),
        status="taken"
    )
    
    # 여기서 DB 저장 로직 수행 (예: base44.entities.MedicationLog.create)
    # await save_log_to_db(log_entry)
    
    return {"message": "Success", "log": log_entry}

# --- 서버 실행 방법 ---
# terminal: uvicorn main:app --reload
