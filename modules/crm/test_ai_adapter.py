import os
from backend.ai_adapters import OptionalAIAdapter

os.environ.pop("DUCK_OPENAI_API_KEY", None)
adapter = OptionalAIAdapter("openai")
assert adapter.enabled is False
assert adapter.complete([])["mode"] == "local"
print("ai adapter tests passed")
