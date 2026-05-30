import os
import json

from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
import google.generativeai as genai

from app.db import get_db
from app.schemas import BugCreate, BugOut, StatusUpdate

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("GEMINI_API_KEY...",GEMINI_API_KEY)
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

router = APIRouter(prefix="/bugs", tags=["Bugs"])


def _row_to_bug(row) -> dict:
    """Convert a sqlite3.Row into a BugOut-compatible dict."""
    return {
        "id": row["id"],
        "raw_description": row["raw_description"],
        "title": row["title"],
        "steps": row["steps"],
        "priority": row["priority"],
        "module": row["module"],
        "bug_type": row["bug_type"],
        "fix_suggestion": row["fix_suggestion"],
        "status": row["status"],
        "created_at": row["created_at"],
        "is_duplicate": bool(row["is_duplicate"]),
        "duplicate_of_id": row["duplicate_of_id"],
    }


def _clean_json(text: str) -> str:
    """Strip markdown code fences that Gemini sometimes wraps JSON in."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text
        if text.startswith("json"):
            text = text[4:]
        if text.endswith("```"):
            text = text[: -3]
    return text.strip()


def analyze_with_gemini(raw_description: str, existing_bugs: list) -> dict:
    """Call Gemini to produce a structured bug report from a raw description."""
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured on the server.",
        )

    existing_bugs_list = "\n".join(
        f"- ID {b['id']}: {b['title'] or b['raw_description']}" for b in existing_bugs
    ) or "None"

    prompt = f"""You are a senior QA engineer. Analyze this bug description and respond ONLY with a valid JSON object, no markdown, no explanation.

Bug description: "{raw_description}"

Existing bugs in system:
{existing_bugs_list}

Respond with this exact JSON:
{{
  "title": "short professional bug title (max 10 words)",
  "steps": "Step 1: ...\\nStep 2: ...\\nStep 3: ...",
  "priority": "Critical|High|Medium|Low",
  "module": "Login|Payment|Dashboard|Profile|API|UI|Other",
  "bug_type": "Logic Error|UI Bug|Performance|Security|Crash|Network|Other",
  "fix_suggestion": "brief technical fix suggestion (1-2 sentences)",
  "is_duplicate": true or false,
  "duplicate_of_id": null or integer id of the existing bug it duplicates
}}

Priority rules: Critical = data loss or security. High = major feature broken. Medium = partial functionality. Low = cosmetic."""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        cleaned = _clean_json(response.text)
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="AI returned an invalid response. Please try again.",
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {exc}")

    return data


@router.post("/", response_model=BugOut)
def create_bug(payload: BugCreate):
    conn = get_db()
    try:
        existing = [dict(r) for r in conn.execute("SELECT * FROM bugs").fetchall()]

        analysis = analyze_with_gemini(payload.raw_description, existing)

        is_duplicate = bool(analysis.get("is_duplicate", False))
        duplicate_of_id = analysis.get("duplicate_of_id")
        if not is_duplicate:
            duplicate_of_id = None

        cursor = conn.execute(
            """
            INSERT INTO bugs (
                raw_description, title, steps, priority, module,
                bug_type, fix_suggestion, is_duplicate, duplicate_of_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.raw_description,
                analysis.get("title"),
                analysis.get("steps"),
                analysis.get("priority"),
                analysis.get("module"),
                analysis.get("bug_type"),
                analysis.get("fix_suggestion"),
                1 if is_duplicate else 0,
                duplicate_of_id,
            ),
        )
        conn.commit()

        row = conn.execute(
            "SELECT * FROM bugs WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()
        return _row_to_bug(row)
    finally:
        conn.close()


@router.get("/", response_model=list[BugOut])
def get_bugs():
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT * FROM bugs ORDER BY id DESC"
        ).fetchall()
        return [_row_to_bug(r) for r in rows]
    finally:
        conn.close()


@router.get("/{bug_id}", response_model=BugOut)
def get_bug(bug_id: int):
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM bugs WHERE id = ?", (bug_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Bug not found")
        return _row_to_bug(row)
    finally:
        conn.close()


@router.patch("/{bug_id}/status", response_model=BugOut)
def update_status(bug_id: int, payload: StatusUpdate):
    valid_statuses = {"Open", "In Progress", "Resolved"}
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(sorted(valid_statuses))}",
        )

    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM bugs WHERE id = ?", (bug_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Bug not found")

        conn.execute(
            "UPDATE bugs SET status = ? WHERE id = ?", (payload.status, bug_id)
        )
        conn.commit()

        updated = conn.execute(
            "SELECT * FROM bugs WHERE id = ?", (bug_id,)
        ).fetchone()
        return _row_to_bug(updated)
    finally:
        conn.close()


@router.delete("/{bug_id}")
def delete_bug(bug_id: int):
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM bugs WHERE id = ?", (bug_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Bug not found")

        conn.execute("DELETE FROM bugs WHERE id = ?", (bug_id,))
        conn.commit()
        return {"message": "Bug deleted successfully", "id": bug_id}
    finally:
        conn.close()
