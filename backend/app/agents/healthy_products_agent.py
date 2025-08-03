import os
import requests

def fetch_healthy_products():
    """
    Fetch healthy products from Walmart API for Reminders section.
    """
    WALMART_API_KEY = os.getenv("WALMART_API_KEY", "demo-key")
    url = "https://api.walmart.com/v3/items"
    params = {
        "apiKey": WALMART_API_KEY,
        "query": "healthy food",
        "format": "json",
        "limit": 6
    }
    try:
        resp = requests.get(url, params=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        products = []
        for item in data.get("items", []):
            products.append({
                "title": item.get("name"),
                "note": item.get("shortDescription", "")
            })
        return {"products": products}
    except Exception as e:
        return {"products": [], "error": str(e)}
