import os
from itertools import cycle

_groq_keys = [
    os.getenv("GROQ_API_KEY"),
    os.getenv("GROQ_API_KEY2"),
    os.getenv("GROQ_API_KEY3")
]
_groq_keys = [k for k in _groq_keys if k]
_groq_key_cycle = cycle(_groq_keys) if _groq_keys else None

def get_next_groq_key():
    """
    Returns the next Groq API key in a round-robin fashion.
    Falls back to GROQ_API_KEY2 if no keys are found.
    """
    if _groq_key_cycle:
        return next(_groq_key_cycle)
    return os.getenv("GROQ_API_KEY2")
