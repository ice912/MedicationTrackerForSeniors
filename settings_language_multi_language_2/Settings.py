from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum

app = FastAPI(title="User Settings API")

# --- 1. 데이터 모델 (Schema) ---

class Language(BaseModel):
    code: str
    label: str

class UserProfile(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    avatar_initial: Optional[str] = None

class UserSettings(BaseModel):
    selected_lang: str = "en"
    sound_enabled: bool = True
    volume_level: int = 80

# --- 2. 상수 데이터 (Languages) ---

LANGUAGES = [
    {"code": "en", "label": "English"},
    {"code": "ko", "label": "한국어 (Korean)"},
    {"code": "es", "label": "Español (Spanish)"},
    {"code": "fr", "label": "Français (French)"},
    {"code": "zh", "label": "中文 (Chinese)"},
    {"code": "ja", "label": "日本語 (Japanese)"},
]

# --- 3. API 엔드포인트 (Controllers) ---

@app.get("/api/settings/languages", response_model=List[Language])
async def get_supported_languages():
    """지원하는 언어 목록 반환"""
    return LANGUAGES

@app.get("/api/auth/me", response_model=UserProfile)
async def get_current_user():
    """
    React의 base44.auth.me() 역할. 
    현재 로그인된 사용자의 프로필 정보를 반환합니다.
    """
    # 실제 환경에선 토큰을 통해 DB에서 사용자 조회
    user_data = {
        "id": "user_123",
        "full_name": "홍길동",
        "email": "gildong@example.com"
    }
    # 이름의 첫 글자를 추출하여 avatar_initial 생성
    user_data["avatar_initial"] = user_data["full_name"][0].upper()
    return user_data

@app.get("/api/user/settings", response_model=UserSettings)
async def get_user_settings():
    """사용자의 설정 값(언어, 소리 등) 로드"""
    return UserSettings()

@app.patch("/api/user/settings")
async def update_settings(settings: UserSettings):
    """
    사용자 설정을 업데이트합니다. 
    React의 setSelectedLang, setSoundEnabled 상태 변경이 이 API를 호출하게 됩니다.
    """
    # DB 업데이트 로직 수행
    return {"message": "Settings updated", "updated_values": settings}

@app.post("/api/auth/logout")
async def logout():
    """
    React의 base44.auth.logout() 역할.
    서버측 세션 만료 또는 토큰 무효화 처리를 수행합니다.
    """
    return {"message": "Successfully logged out"}

@app.get("/api/support/emergency-contacts")
async def get_emergency_contacts():
    """비상 연락처 정보 반환"""
    return {
        "emergency_service": "local emergency services",
        "contacts": [
            {"name": "Family", "phone": "010-1234-5678"},
            {"name": "Doctor", "phone": "02-987-6543"}
        ]
    }
