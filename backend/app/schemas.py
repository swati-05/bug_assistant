from pydantic import BaseModel, Field
from typing import Optional


class BugCreate(BaseModel):
    raw_description: str = Field(..., example="The login page crashes when I click submit")


class BugOut(BaseModel):
    id: int
    raw_description: str
    title: Optional[str]
    steps: Optional[str]
    priority: Optional[str]
    module: Optional[str]
    bug_type: Optional[str]
    fix_suggestion: Optional[str]
    status: str
    created_at: str
    is_duplicate: Optional[bool] = False
    duplicate_of_id: Optional[int] = None


class StatusUpdate(BaseModel):
    status: str = Field(..., example="Resolved")
