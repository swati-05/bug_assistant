import os
import sqlite3

# Store the SQLite database file next to this module so it is created
# inside the backend/app directory regardless of where uvicorn is launched.
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bugs.db")


def get_db():
    """Return a SQLite connection with row access by column name."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the bugs table on startup if it does not already exist."""
    conn = get_db()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS bugs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                raw_description TEXT NOT NULL,
                title TEXT,
                steps TEXT,
                priority TEXT,
                module TEXT,
                bug_type TEXT,
                fix_suggestion TEXT,
                status TEXT DEFAULT 'Open',
                is_duplicate INTEGER DEFAULT 0,
                duplicate_of_id INTEGER,
                created_at TEXT DEFAULT (datetime('now'))
            );
            """
        )
        conn.commit()
    finally:
        conn.close()
