from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from rent_scrapper import get_average_price
from engine import get_real_blindspots
app = FastAPI()

def get_db_connection():
    # Connect to the database and return rows as dictionaries
    conn = sqlite3.connect("data.db")
    conn.row_factory = sqlite3.Row
    return conn

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/v1/avgrent/{city_name}")
async def get_price(city_name: str):
    results = get_average_price(city_name)
    return results

@app.get("/api/v1/coord/{location}/{cat_type}/{cat_val}")
async def get_coord(location: str, cat_type: str, cat_val: str):
    blindspots, shops = get_real_blindspots(location, cat_type, cat_val)
    
    # Check if we have data to avoid iteration errors
    if len(shops) == 0:
        return {
            "shops": {},
            "blindspots": {},
            "message": f"No {cat_val} found in {location}. Try another category."
        }
    
    # Standard conversion
    shops_dict = {str(lat): float(lng) for lat, lng in shops}
    blindspots_dict = {str(lat): float(lng) for lat, lng in blindspots}

    return {
        "shops": shops_dict,
        "blindspots": blindspots_dict
    }
