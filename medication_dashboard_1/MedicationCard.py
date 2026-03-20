from dataclasses import dataclass
from typing import Optional

@dataclass
class MedicationCard:
    id: str
    name: str
    purpose: Optional[str] = None
    dosage: Optional[str] = None
    is_taken: bool = False
    loading: bool = False

    def get_display_text(self):
        """React의 {medication.purpose || medication.dosage || 'Daily medication'} 로직"""
        return self.purpose or self.dosage or "Daily medication"

    def get_button_text(self):
        """버튼 내 텍스트 조건부 렌더링 로직"""
        if self.loading:
            return "Loading..."
        return "Already Taken ✓" if self.is_taken else "I TOOK THIS"
