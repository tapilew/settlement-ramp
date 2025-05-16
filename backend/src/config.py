from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    # ChainSettle Configuration
    CHAINSETTLE_API_URL = "https://app.chainsettle.tech"
    CHAINSETTLE_AKASH_URL = "https://gdvsns5685f696ufl48m643lc4.ingress.akash-palmito.org"

    # ChainSettle Contract Addresses
    CHAINSETTLE_SETTLEMENT_REGISTRY = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    CHAINSETTLE_ATTEST = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

    # ChainSettle Supported Networks
    CHAINSETTLE_SUPPORTED_NETWORKS = ["base", "base-sepolia", "ethereum", "sepolia"]

    # ChainSettle Supported APIs
    CHAINSETTLE_SUPPORTED_APIS = ["paypal", "github", "stripe"]

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings() 