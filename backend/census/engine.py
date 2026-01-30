import numpy as np
from sklearn.neighbors import KDTree
import requests
from shapely.geometry import shape, Point

def get_real_blindspots(location_name, category_type, category_value, threshold=0.02):
    # 1. Get Geometry (Polygon) instead of just Bounding Box
    geo_url = "https://nominatim.openstreetmap.org/search"
    geo_params = {'q': location_name, 'format': 'json', 'polygon_geojson': 1, 'limit': 1}
    headers = {'User-Agent': 'ZonelyApp/1.0'}
    
    geo_data = requests.get(geo_url, params=geo_params, headers=headers).json()
    if not geo_data: return np.array([]), np.array([])

    # Create a Shapely object from the city boundary
    city_shape = shape(geo_data[0]['geojson'])
    bbox = geo_data[0]['boundingbox']
    s_lat, n_lat, w_lon, e_lon = [float(x) for x in bbox]

    # 2. Fetch shops
    points = get_coordinates(location_name, category_type, category_value)
    if not points: return np.array([]), np.array([])
    shop_coords = np.array([[p[1], p[2]] for p in points])

    # 3. Create Grid
    lats = np.linspace(s_lat, n_lat, 40) 
    lons = np.linspace(w_lon, e_lon, 40)
    
    # 4. ONLY keep points inside the actual city boundary
    valid_grid_points = []
    for lat in lats:
        for lon in lons:
            point = Point(lon, lat) # Shapely uses (x, y) -> (lon, lat)
            if city_shape.contains(point):
                valid_grid_points.append((lat, lon))
    
    if not valid_grid_points: return np.array([]), shop_coords
    grid_points = np.array(valid_grid_points)

    # 5. Calculate Blindspots
    tree = KDTree(shop_coords)
    dist, _ = tree.query(grid_points, k=1) 
    blindspots = grid_points[dist.flatten() > threshold]
    
    return blindspots, shop_coords

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

