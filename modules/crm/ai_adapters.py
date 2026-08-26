from __future__ import annotations

import os
from typing import Any

import requests


class OptionalAIAdapter:
    """API-key gated adapter. No key means the local rules engine remains active."""

    def __init__(self, provider: str = "openai"):
        self.provider = provider
        self.api_key = os.getenv("DUCK_OPENAI_API_KEY") if provider == "openai" else None

    @property
    def enabled(self) -> bool:
        return bool(self.api_key)

    def complete(self, messages: list[dict[str, str]]) -> dict[str, Any]:
        if not self.enabled:
            return {"mode": "local", "text": "Modo local ativo: nenhum API key foi configurado."}
        response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Authorization": f"Bearer {self.api_key}"}, json={"model": "gpt-4o-mini", "messages": messages, "temperature": 0.3}, timeout=30)
        response.raise_for_status()
        data = response.json()
        return {"mode": "openai", "text": data["choices"][0]["message"]["content"]}
