import requests

def get_coordinates(location_name, category_type, category_value):
    # 1. Get Area ID from Location Name
    geo_url = "https://nominatim.openstreetmap.org/search"
    geo_params = {'q': location_name, 'format': 'json', 'limit': 1}
    headers = {'User-Agent': 'CoordFinder/1.0'}
    
    geo_data = requests.get(geo_url, params=geo_params, headers=headers).json()
    if not geo_data:
        return "Location not found."
    
    area_id = int(geo_data[0]['osm_id']) + 3600000000

    # 2. Query Overpass for Coordinates
    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    area(id:{area_id})->.searchArea;
    nwr["{category_type}"="{category_value}"](area.searchArea);
    out center;
    """

    response = requests.post(overpass_url, data={'data': query})
    elements = response.json().get('elements', [])

    # 3. Extract only Name and Coords
    results = []
    for e in elements:
        name = e.get('tags', {}).get('name', 'Unnamed')
        lat = e.get('lat') or e.get('center', {}).get('lat')
        lon = e.get('lon') or e.get('center', {}).get('lon')
        results.append((name, lat, lon))

    return results

# --- Quick Execution ---
# Example: All "Pharmacy" coordinates in "Chennai"
points = get_coordinates("Chennai", "amenity", "pharmacy")

for name, lat, lon in points:
    print(f"{name}: {lat}, {lon}")