from fastapi import APIRouter

from app.db import get_db

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/")
def get_analytics():
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM bugs").fetchall()
    finally:
        conn.close()

    by_priority: dict[str, int] = {}
    by_module: dict[str, int] = {}
    by_status: dict[str, int] = {}
    by_bug_type: dict[str, int] = {}
    duplicates_detected = 0

    for row in rows:
        priority = row["priority"] or "Other"
        module = row["module"] or "Other"
        status = row["status"] or "Open"
        bug_type = row["bug_type"] or "Other"

        by_priority[priority] = by_priority.get(priority, 0) + 1
        by_module[module] = by_module.get(module, 0) + 1
        by_status[status] = by_status.get(status, 0) + 1
        by_bug_type[bug_type] = by_bug_type.get(bug_type, 0) + 1

        if row["is_duplicate"]:
            duplicates_detected += 1

    return {
        "total": len(rows),
        "by_priority": by_priority,
        "by_module": by_module,
        "by_status": by_status,
        "by_bug_type": by_bug_type,
        "duplicates_detected": duplicates_detected,
    }
