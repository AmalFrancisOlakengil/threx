from fastapi import FastAPI, HTTPException
import requests
from bs4 import BeautifulSoup
import re

app = FastAPI()

@app.get("/api/v1/avgrent/{city_name}")
async def get_average_price(city_name: str):
    # Construct URL dynamically based on city name
    url = f"https://www.magicbricks.com/property-for-rent/commercial-real-estate?proptype=Commercial-Shop,Commercial-Showroom&cityName={city_name}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return f"Error: Received status code {response.status_code}"

        soup = BeautifulSoup(response.content, 'html.parser')
        cards = soup.find_all('div', class_='mb-srp__card')
        
        prices = []

        for card in cards:
            price_element = card.find('div', class_='mb-srp__card__price--amount')
            if price_element:
                price_text = price_element.text.strip().lower()
                
                # Logic to convert price strings (e.g., '1.5 Lac' or '5,000') to floats
                # 1. Remove currency symbols and commas
                clean_price = re.sub(r'[^\d.]', '', price_text) 
                
                if clean_price:
                    val = float(clean_price)
                    # 2. Handle multipliers (Lac/Cr)
                    if 'lac' in price_text:
                        val *= 100000
                    elif 'cr' in price_text:
                        val *= 10000000
                    
                    prices.append(val)

        if not prices:
            return 0.0

        avg_price = sum(prices) / len(prices)
        return round(avg_price, 2)

    except Exception as e:
        raise HTTPException(status_code=404, detail=e)


