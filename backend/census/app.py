from fastapi import FastAPI, HTTPException
import sqlite3

app = FastAPI()

def get_db_connection():
    # Connect to the database and return rows as dictionaries
    conn = sqlite3.connect("data.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/v1/labour/{district_code}")
async def get_labour_by_district(district_code: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Using double quotes for column names with spaces
    query = 'SELECT * FROM labour WHERE "District Code" = ?'
    rows = cursor.execute(query, (district_code,)).fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No labour data found for this district code")
    
    return [dict(row) for row in rows]

@app.get("/api/v1/population/{district_code}")
async def get_population_by_district(district_code: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM population WHERE "District Code" = ?'
    rows = cursor.execute(query, (district_code,)).fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No population data found for this district code")
    
    return [dict(row) for row in rows]