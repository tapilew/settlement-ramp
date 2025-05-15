import pytest
from src.services.paypal_service import PayPalService
from unittest.mock import patch, MagicMock

@pytest.fixture
def paypal_service():
    return PayPalService()

def test_create_payment(paypal_service):
    with patch('paypalrestsdk.Payment') as mock_payment:
        # Configurar el mock
        mock_payment_instance = MagicMock()
        mock_payment_instance.create.return_value = True
        mock_payment_instance.id = "test_payment_id"
        mock_payment_instance.links = [
            MagicMock(),
            MagicMock(href="https://sandbox.paypal.com/test_payment")
        ]
        mock_payment.return_value = mock_payment_instance

        # Probar la creación del pago
        result = paypal_service.create_payment(
            amount=100.0,
            recipient_email="test@example.com",
            escrow_id="test_escrow_123"
        )

        assert result["payment_id"] == "test_payment_id"
        assert result["status"] == "created"
        assert "approval_url" in result

def test_verify_payment(paypal_service):
    with patch('paypalrestsdk.Payment') as mock_payment:
        # Configurar el mock
        mock_payment_instance = MagicMock()
        mock_payment_instance.id = "test_payment_id"
        mock_payment_instance.state = "approved"
        mock_payment_instance.transactions = [
            MagicMock(amount=MagicMock(total="100.00", currency="USD"))
        ]
        mock_payment.find.return_value = mock_payment_instance

        # Probar la verificación del pago
        result = paypal_service.verify_payment("test_payment_id")

        assert result["payment_id"] == "test_payment_id"
        assert result["status"] == "approved"
        assert result["amount"] == "100.00"
        assert result["currency"] == "USD"

def test_execute_payment(paypal_service):
    with patch('paypalrestsdk.Payment') as mock_payment:
        # Configurar el mock
        mock_payment_instance = MagicMock()
        mock_payment_instance.id = "test_payment_id"
        mock_payment_instance.state = "completed"
        mock_payment_instance.transactions = [
            MagicMock(amount=MagicMock(total="100.00", currency="USD"))
        ]
        mock_payment_instance.execute.return_value = True
        mock_payment.find.return_value = mock_payment_instance

        # Probar la ejecución del pago
        result = paypal_service.execute_payment(
            payment_id="test_payment_id",
            payer_id="test_payer_id"
        )

        assert result["payment_id"] == "test_payment_id"
        assert result["status"] == "completed"
        assert result["amount"] == "100.00"
        assert result["currency"] == "USD" 