import json
from fastapi import APIRouter, Query
from pathlib import Path
import os
import requests

router = APIRouter()

# Helper to call Groq LLM
def call_groq_for_products(report_text, template_products):
    api_key = os.getenv("GROQ_API_KEY2")
    prompt = f"""
You are a helpful health assistant. Based on the following diagnosis report, recommend a list of health products that could help the patient. You MUST change the product names and prices to be relevant for the illness, but keep the number of products, images, and ratings the same as the template. Output only a JSON array with the same structure as the template, but with new product names and prices. DO NOT repeat the template product names or prices. If the diagnosis is not specific, invent plausible health product names and prices for the context.

Diagnosis Report:
{report_text}

Template Products:
{json.dumps(template_products, indent=2)}

Instructions:
- You MUST change the 'name' and 'price' fields for every product to be relevant for the diagnosis. Do NOT repeat the template names or prices.
- Keep the number of products, images, and ratings the same.
- Output only valid JSON (array of products).
"""
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama3-70b-8192",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3
        },
        verify=False
    )
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    # Extract JSON array from response
    try:
        start = content.index("[")
        end = content.rindex("]") + 1
        products = json.loads(content[start:end])
        # If the LLM returned the template unchanged, force a change in names/prices
        if products == template_products:
            for i, prod in enumerate(products):
                prod["name"] += f" (AI)"
                prod["price"] = f"${round(float(prod["price"].replace('$','')) + 1.11 + i, 2)}"
        return products
    except Exception as e:
        raise


# Direct Python function for internal use (diagnosis agent)
def get_recommended_products_for_session(session_id: str):
    data_dir = Path(__file__).parent.parent.parent / "data"
    report_path = data_dir / "report.json"
    template_path = data_dir / "recommended_products.json"

    # Load template products
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            template_products = json.load(f)
    except Exception as e:
        template_products = []

    # Load diagnosis report for session_id
    try:
        with open(report_path, "r", encoding="utf-8") as f:
            all_reports = json.load(f)
        report_text = all_reports.get(session_id, "")
    except Exception as e:
        report_text = ""

    if not report_text:
        return {"error": "No report text found for session_id."}
    if not template_products:
        return {"error": "No template products found."}

    # Call Groq LLM to get product recommendations
    try:
        products = call_groq_for_products(report_text, template_products)
        return {"products": products}
    except Exception as e:
        return {"error": "Failed to get AI product recommendations."}

# FastAPI endpoint for FE (remains compatible)
@router.get("/recommended-products")
def get_recommended_products(session_id: str = Query(...)):
    return get_recommended_products_for_session(session_id)
