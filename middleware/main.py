import os

import requests
from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/trigger-attestation", methods=["POST"])
def trigger_attestation():
    try:
        # Get ChainSettle API details from environment variables
        api_url = os.getenv("CHAINSETTLE_API_URL")
        auth_token = os.getenv("CHAINSETTLE_AUTH_TOKEN")

        if not api_url or not auth_token:
            return jsonify({"error": "Missing required environment variables"}), 500

        # Call ChainSettle API
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json",
        }

        response = requests.post(api_url, headers=headers)
        response.raise_for_status()

        return jsonify(
            {"status": "success", "message": "Attestation triggered successfully"}
        ), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to trigger attestation: {e!s}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e!s}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
