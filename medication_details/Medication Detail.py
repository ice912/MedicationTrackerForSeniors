from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="Medication Detail API")

# --- 1. 데이터 모델 (Schema) ---

class Medication(BaseModel):
    id: str
    name: str
    dosage: Optional[str] = None
    form: Optional[str] = None      # 예: tablet, capsule
    purpose: Optional[str] = None
    frequency: str = "once_daily"   # twice_daily, as_needed 등
    time_of_day: str = "morning"
    instructions: Optional[str] = None
    pill_image_url: Optional[str] = None

class MedicationLog(BaseModel):
    medication_id: str
    medication_name: str
    taken_date: str
    taken_time: str
    status: str = "taken"

class MedicationDetailResponse(BaseModel):
    medication: Medication
    is_taken_today: bool
    last_taken_time: Optional[str] = None

# --- 2. 비즈니스 로직 및 가상 DB ---

async def get_medication_by_id(med_id: str) -> Optional[Medication]:
    # base44.entities.Medication.filter({ id: medId }) 역할
    # 실제로는 DB에서 해당 ID의 약물을 쿼리합니다.
    return Medication(
        id=med_id,
        name="혈압약",
        dosage="5mg",
        form="tablet",
        purpose="혈압 조절 및 심장 건강 관리",
        frequency="once_daily",
        time_of_day="morning",
        instructions="식사 후 30분 뒤에 복용하세요.",
        pill_image_url="https://example.com"
    )

async def get_today_logs(med_id: str) -> List[MedicationLog]:
    # 오늘 날짜의 복용 로그를 가져오는 로직
    return []

# --- 3. API 엔드포인트 (Controllers) ---

@app.get("/api/medications/{med_id}", response_model=MedicationDetailResponse)
async def get_medication_detail(med_id: str):
    """
    약물 상세 정보와 오늘의 복용 상태를 함께 반환합니다.
    (React의 useQuery 2개를 합친 역할)
    """
    # 1. 약물 정보 조회
    medication = await get_medication_by_id(med_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    # 2. 오늘 복용 로그 확인
    today = datetime.now().strftime("%Y-%m-%d")
    logs = await get_today_logs(med_id)
    
    # 해당 약물의 오늘 마지막 복용 기록 확인 (React의 useMemo 역할)
    med_logs = [log for log in logs if log.medication_id == med_id and log.status == "taken"]
    is_taken_today = len(med_logs) > 0
    last_taken_time = med_logs[-1].taken_time if is_taken_today else None

    return {
        "medication": medication,
        "is_taken_today": is_taken_today,
        "last_taken_time": last_taken_time
    }

@app.post("/api/medications/{med_id}/take", status_code=status.HTTP_201_CREATED)
async def mark_as_taken(med_id: str):
    """
    약물을 복용 완료 상태로 기록합니다. (React의 markTaken 함수)
    """
    medication = await get_medication_by_id(med_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    now = datetime.now()
    new_log = MedicationLog(
        medication_id=med_id,
        medication_name=medication.name,
        taken_date=now.strftime("%Y-%m-%d"),
        taken_time=now.strftime("%H:%M"),
        status="taken"
    )

    # DB 저장 로직 (예: base44.entities.MedicationLog.create)
    # await db.save(new_log)
    
    return {"message": "Success", "log": new_log}
