from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = FastAPI(
    title="Settlement Ramp API",
    description="API para el sistema de Settlement Ramp",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class PaymentRequest(BaseModel):
    amount: float
    recipient_email: str
    escrow_id: str
    payer_address: str

class PaymentResponse(BaseModel):
    payment_id: str
    status: str
    paypal_url: Optional[str] = None

# Rutas
@app.get("/")
async def root():
    return {"message": "Bienvenido a Settlement Ramp API"}

@app.post("/payments/initiate", response_model=PaymentResponse)
async def initiate_payment(payment: PaymentRequest):
    try:
        # Aquí irá la lógica para iniciar el pago con PayPal
        # Por ahora, retornamos una respuesta simulada
        return PaymentResponse(
            payment_id="test_payment_123",
            status="pending",
            paypal_url="https://sandbox.paypal.com/test_payment"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/payments/{payment_id}/status")
async def get_payment_status(payment_id: str):
    try:
        # Aquí irá la lógica para verificar el estado del pago
        return {
            "payment_id": payment_id,
            "status": "pending",
            "details": "Payment is being processed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 