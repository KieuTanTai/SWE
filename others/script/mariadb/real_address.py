import json
import time
import random
import requests

# LOG helper
def log(msg):
    print(f"[LOG][{time.strftime('%H:%M:%S')}] {msg}")

def log_error(msg):
    print(f"[ERROR][{time.strftime('%H:%M:%S')}] {msg}")

def log_warn(msg):
    print(f"[WARN][{time.strftime('%H:%M:%S')}] {msg}")

# 1. Đọc file địa chỉ đầu vào
INPUT_PATH = "./_SELECT_address_address_id_lc_location_city_name_ld_location_dis_202511222211.json"

log(f"Đang đọc dữ liệu từ file: {INPUT_PATH}")
try:
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
except Exception as e:
    log_error(f"Lỗi đọc file: {e}")
    exit(1)

key = next(iter(data))
rows = data[key][:20]  # chỉ lấy 20 dòng đầu

# 2. Hàm tìm polygon vùng thực tế bằng Nominatim (OpenStreetMap)
def get_area_polygon(ward, district, city):
    query = f"{ward}, {district}, {city}, Việt Nam"
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "polygon_geojson": 1,
        "addressdetails": 1,
        "limit": 1
    }
    try:
        resp = requests.get(url, params=params, headers={"User-Agent": "PythonTestAddress/1.0"})
        resp.raise_for_status()
        results = resp.json()
        if results:
            log(f"Tìm thấy vùng: {results[0]['display_name']}")
            return results[0]['geojson'], results[0].get('boundingbox')
        else:
            log_warn(f"Không tìm thấy vùng: {query}")
            return None, None
    except Exception as e:
        log_warn(f"Lỗi khi gọi Nominatim cho vùng: {query}: {e}")
        return None, None

# 3. Hàm tìm số nhà thực tế trong vùng bằng Overpass API (tra cứu dựa bbox hoặc polygon - thực tế OSM chỉ lưu số nhà dạng node/way)
def fetch_house_numbers(bbox):
    # bbox: ['lat_min', 'lat_max', 'lon_min', 'lon_max']
    if not bbox or len(bbox) < 4:
        return []

    bbox_str = f"{bbox[0]},{bbox[2]},{bbox[1]},{bbox[3]}" # south,west,north,east (OSM quy định)
    # Truy vấn node có addr:housenumber trong bbox
    query = f"""
[out:json][timeout:25];
(
    node["addr:housenumber"]({bbox_str});
    way["addr:housenumber"]({bbox_str});
);
out tags center;
"""
    # Có thể xoay quanh nhiều endpoint, ở đây dùng 1 cái ổn định
    url = "https://lz4.overpass-api.de/api/interpreter"
    try:
        resp = requests.post(url, data=query, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        housenumbers = [
            elem["tags"]["addr:housenumber"] for elem in data.get("elements", [])
            if "tags" in elem and "addr:housenumber" in elem["tags"]
        ]
        return list(set(housenumbers))
    except Exception as e:
        log_warn(f"Lỗi khi gọi Overpass lấy số nhà: {e}")
        return []

# 4. Duyệt từng dòng, trả về số nhà thực tế trong vùng phường + quận + thành phố
new_rows = []
for idx, r in enumerate(rows):
    ward = r["location_ward_name"]
    district = r["location_district_name"]
    city = r["location_city_name"]
    addr_num = r["address_number"]

    log(f"{idx+1:02d}/{len(rows)} | Đang xử lý: {ward}, {district}, {city}, số nhà cũ: {addr_num}")

    polygon, bbox = get_area_polygon(ward, district, city)
    matched_number = ""
    if bbox:
        nhouse = fetch_house_numbers(bbox)
        if nhouse:
            matched_number = random.choice(nhouse)
            log(f"Chọn số nhà thực tế theo OSM: {matched_number}")
        else:
            log_warn("Không tìm được số nhà thực tế OSM, giữ nguyên addr_num cũ")
            matched_number = addr_num
    else:
        # Không tìm boundingbox, giữ nguyên
        matched_number = addr_num

    new_row = {
        "address_id": r.get("address_id"),
        "location_city_name": city,
        "location_district_name": district,
        "location_ward_name": ward,
        "old_address_number": addr_num,
        "osm_house_number": matched_number
    }
    new_rows.append(new_row)
    time.sleep(1)  # tránh spam API

# 5. Lưu kết quả batch ra file JSON
OUTPUT_PATH = "osm_corrected_house_numbers_batch1.json"
log(f"Lưu batch kết quả ra file: {OUTPUT_PATH}")
try:
    out = {"batch1": new_rows}
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    log("Ghi file thành công!")
except Exception as e:
    log_error(f"Lỗi ghi file: {e}")
