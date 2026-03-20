import asyncio
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel

# 1. 카테고리 정의 (TypeScript의 enum 역할)
class Category(str, Enum):
    exercise = "exercise"
    water = "water"
    nutrition = "nutrition"
    social = "social"
    mental = "mental"
    sleep = "sleep"

# 2. 데이터 구조 정의
class Tip(BaseModel):
    title_start: str
    highlight: str
    description: str
    category: Category

class AdviceResponse(BaseModel):
    tips: List[Tip]

# 3. 아이콘/색상 맵 (프론트엔드 전달용 데이터)
ICON_MAP = {
    "exercise": {"icon_bg": "bg-orange-100", "icon_color": "text-orange-600", "icon": "Footprints"},
    "water": {"icon_bg": "bg-blue-100", "icon_color": "text-blue-600", "icon": "Droplets"},
    "nutrition": {"icon_bg": "bg-green-100", "icon_color": "text-green-600", "icon": "Apple"},
    "social": {"icon_bg": "bg-purple-100", "icon_color": "text-purple-600", "icon": "Phone"},
    "mental": {"icon_bg": "bg-indigo-100", "icon_color": "text-indigo-600", "icon": "Brain"},
    "sleep": {"icon_bg": "bg-sky-100", "icon_color": "text-sky-600", "icon": "Brain"},
}

async def get_lifestyle_advice():
    """
    React의 refreshAdvice 함수와 동일한 로직을 수행합니다.
    """
    prompt = """
    Generate 4 simple lifestyle health tips for elderly/senior users. 
    Each tip should be warm, encouraging, and easy to understand. 
    Focus on topics like: gentle exercise, hydration, nutrition, social connection, mental wellness, sleep, or stretching.
    Make each tip short and actionable. Use simple language a grandparent would understand.
    """

    # base44.integrations.Core.InvokeLLM 호출 부분 (가상의 SDK 호출로 대체)
    # 실제 환경에선 OpenAI나 LangChain 등을 사용하게 됩니다.
    try:
        # result = await base44.invoke_llm(prompt=prompt, schema=AdviceResponse.schema())
        # 아래는 결과 처리 예시입니다.
        raw_result = {
            "tips": [
                {
                    "title_start": "Walk for",
                    "highlight": "10 minutes today",
                    "description": "Good for your heart and energy.",
                    "category": "exercise"
                },
                # ... 추가 데이터
            ]
        }
        
        # 4. 데이터 가공 (React의 newAdvice 로직)
        processed_advice = []
        for tip in raw_result["tips"]:
            style = ICON_MAP.get(tip["category"], ICON_MAP["exercise"])
            processed_advice.append({
                "title": f"{tip['title_start']} ",
                "highlight": tip["highlight"],
                "description": tip["description"],
                **style
            })
            
        return processed_advice

    except Exception as e:
        print(f"Error fetching advice: {e}")
        return []

# 실행 예시
if __name__ == "__main__":
    advice_list = asyncio.run(get_lifestyle_advice())
    for item in advice_list:
        print(f"[{item['highlight']}] {item['title']} - {item['description']}")
