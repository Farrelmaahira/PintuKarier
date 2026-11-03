"""Fixture bersama: tidak ada test yang diam-diam manggil provider AI asli."""

from __future__ import annotations

import pytest


@pytest.fixture(autouse=True)
def reset_settings_cache() -> None:
    from app.config import get_settings

    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
