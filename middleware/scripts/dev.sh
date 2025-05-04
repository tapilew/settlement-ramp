#!/bin/bash

# Exit on error
set -e

# Sync dependencies
echo "Syncing dependencies..."
uv pip install -e .

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Run Flask application
echo "Starting Flask server..."
flask --app main run -p 3000 