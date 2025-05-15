# Settlement Ramp Backend

Este es el backend para el proyecto Settlement Ramp, que maneja la integración con PayPal Sandbox y la interacción con contratos inteligentes en Base Sepolia.

## Requisitos

- Python 3.8+
- pip o uv
- Acceso a Internet
- Cuenta de PayPal Sandbox
- Wallet con ETH en Base Sepolia

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/your-username/settlement-ramp.git
cd settlement-ramp/backend
```

2. Crear y activar un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
uvicorn src.main:app --reload
```

El servidor estará disponible en `http://localhost:8000`

## Documentación de la API

Una vez que el servidor esté corriendo, puedes acceder a la documentación de la API en:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Estructura del Proyecto

```
backend/
├── src/
│   ├── main.py              # Punto de entrada de la aplicación
│   ├── config.py            # Configuración de la aplicación
│   ├── models/              # Modelos de datos
│   ├── services/            # Servicios de negocio
│   └── utils/               # Utilidades
├── tests/                   # Tests unitarios y de integración
├── scripts/                 # Scripts de utilidad
├── requirements.txt         # Dependencias del proyecto
└── README.md               # Este archivo
```

## Endpoints Principales

- `POST /payments/initiate`: Inicia un nuevo pago
- `GET /payments/{payment_id}/status`: Verifica el estado de un pago

## Desarrollo

Para ejecutar los tests:

```bash
pytest
```

## Licencia

MIT 