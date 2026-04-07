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
            "blindspots": [],
            "message": f"No {cat_val} found in {location}. Try another category."
        }
    
    # Standard conversion
    shops_dict = {str(lat): float(lng) for lat, lng in shops}
    # blindspots is now a list of dicts from engine.py

    return {
        "shops": shops_dict,
        "blindspots": blindspots
    }

@app.get("/api/v1/full_analysis/{district_code}/{city_name}/{cat_type}/{cat_val}")
async def get_full_analysis(district_code: int, city_name: str, cat_type: str, cat_val: str):
    # 1. Fetch all data in parallel (conceptually, here sequential for simplicity)
    try:
        blindspots, shops = get_real_blindspots(city_name, cat_type, cat_val)
        shops_dict = {str(lat): float(lng) for lat, lng in shops}
        
        pop_data = await get_population_by_district(district_code)
        labour_data = await get_labour_by_district(district_code)
        avg_rent = get_average_price(city_name)
        
        # 2. Calculate Opportunity Score
        # Opportunity Index = (PopDensity * Retail_Workforce_Ratio) / Rent
        # We'll use simple normalization factors based on typical TN ranges
        
        total_pop_data = next((item for item in pop_data if item["Type"] == "Total"), pop_data[0])
        density = float(total_pop_data.get("Population per sq. km.", 1))
        
        retail_workers = float(labour_data[0].get("Wholesale and retail", 0))
        total_workers = float(labour_data[0].get("Main workers", 1))
        retail_ratio = retail_workers / total_workers if total_workers > 0 else 0.1
        
        rent = float(avg_rent) if isinstance(avg_rent, (int, float)) and avg_rent > 0 else 5000
        
        # Heuristic formula for opportunity index (0-100)
        # Higher density = more customers
        # Higher retail ratio = established market/workforce
        # Lower rent = lower cost
        raw_score = (density * retail_ratio * 1000) / rent
        opportunity_score = min(100, max(10, round(raw_score, 1)))

        return {
            "map": {
                "shops": shops_dict,
                "blindspots": blindspots
            },
            "population": pop_data,
            "labour": labour_data,
            "rent": avg_rent,
            "opportunity_score": opportunity_score,
            "metrics": {
                "density": density,
                "retail_ratio": round(retail_ratio * 100, 2),
                "competition_count": len(shops)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/compare")
async def compare_districts(district_codes: str, city_names: str):
    codes = [int(c) for c in district_codes.split(",")]
    cities = city_names.split(",")
    
    results = []
    for code, city in zip(codes, cities):
        try:
            pop_data = await get_population_by_district(code)
            total_pop = next((item for item in pop_data if item["Type"] == "Total"), pop_data[0])
            avg_rent = get_average_price(city)
            labour_data = await get_labour_by_district(code)
            
            results.append({
                "district": city.capitalize(),
                "population": total_pop["Persons"],
                "density": total_pop["Population per sq. km."],
                "rent": avg_rent,
                "retail_workers": labour_data[0].get("Wholesale and retail", 0)
            })
        except:
            continue
            
    return results
