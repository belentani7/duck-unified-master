from backend.main import APIKeyCheck, validate_api_key

assert validate_api_key(APIKeyCheck(provider="openai", api_key="x" * 24))["valid"] is True
assert validate_api_key(APIKeyCheck(provider="anthropic", api_key="x" * 24))["valid"] is False
assert validate_api_key(APIKeyCheck(provider="openai", api_key="short"))["valid"] is False
print("api config tests passed")
