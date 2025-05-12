# import os
# import json
# import requests

# def json_agent(input_text: str, json_format: dict | str, groq_api_key: str, model: str = "llama3-70b-8192") -> dict:
#     """
#     Converts input_text into structured JSON using Groq LLM.

#     Args:
#         input_text (str): The raw text to structure.
#         json_format (dict or str): Desired JSON schema (as dict or string).
#         groq_api_key (str): Your Groq API key.
#         model (str): The Groq LLM model to use (default: llama3-70b-8192).

#     Returns:
#         dict: Parsed structured JSON.
#     """
#     if isinstance(json_format, dict):
#         format_str = json.dumps(json_format, indent=2)
#     else:
#         format_str = json_format.strip()

#     prompt = f"""
# You are a helpful assistant that converts natural language into structured JSON format.

# FORMAT:
# {format_str}

# TEXT:
# {input_text}

# INSTRUCTIONS:
# - Match the keys in the format exactly.
# - If any values are missing in the input, use empty strings or empty lists.
# - Output ONLY valid JSON. No commentary or explanations.
# """

#     response = requests.post(
#         "https://api.groq.com/openai/v1/chat/completions",
#         headers={
#             "Authorization": f"Bearer {groq_api_key}",
#             "Content-Type": "application/json"
#         },
#         json={
#             "model": model,
#             "messages": [{"role": "user", "content": prompt}],
#             "temperature": 0.2
#         }
#     )

#     output = response.json()["choices"][0]["message"]["content"]
#     return json.loads(output)
