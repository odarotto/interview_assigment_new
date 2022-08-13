import sqlite3


def execute_query(database: str, query: str, returns: bool=False):
    with sqlite3.connect(database) as conn:
        result = conn.execute(query).fetchall()
    return result

