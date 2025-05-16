from paypalrestsdk import Payment
import os
from ..config import get_settings

settings = get_settings()

class PayPalService:
    def __init__(self):
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET
        self.mode = settings.PAYPAL_MODE

    def create_payment(self, amount: float, recipient_email: str, escrow_id: str) -> dict:
        """
        Crea un pago en PayPal Sandbox
        """
        try:
            payment = Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "transactions": [{
                    "amount": {
                        "total": str(amount),
                        "currency": "USD"
                    },
                    "description": f"Payment for escrow {escrow_id}",
                    "custom": escrow_id
                }],
                "redirect_urls": {
                    "return_url": f"http://localhost:3000/payment/success",
                    "cancel_url": f"http://localhost:3000/payment/cancel"
                }
            })

            if payment.create():
                return {
                    "payment_id": payment.id,
                    "status": "created",
                    "approval_url": payment.links[1].href
                }
            else:
                raise Exception(payment.error)

        except Exception as e:
            raise Exception(f"Error creating PayPal payment: {str(e)}")

    def verify_payment(self, payment_id: str) -> dict:
        """
        Verifica el estado de un pago en PayPal
        """
        try:
            payment = Payment.find(payment_id)
            return {
                "payment_id": payment.id,
                "status": payment.state,
                "amount": payment.transactions[0].amount.total,
                "currency": payment.transactions[0].amount.currency
            }
        except Exception as e:
            raise Exception(f"Error verifying PayPal payment: {str(e)}")

    def execute_payment(self, payment_id: str, payer_id: str) -> dict:
        """
        Ejecuta un pago aprobado en PayPal
        """
        try:
            payment = Payment.find(payment_id)
            if payment.execute({"payer_id": payer_id}):
                return {
                    "payment_id": payment.id,
                    "status": payment.state,
                    "amount": payment.transactions[0].amount.total,
                    "currency": payment.transactions[0].amount.currency
                }
            else:
                raise Exception(payment.error)
        except Exception as e:
            raise Exception(f"Error executing PayPal payment: {str(e)}") 