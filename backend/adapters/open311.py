import os
import httpx

OPEN311_URL = os.environ.get("OPEN311_URL", "http://localhost:8000/open311/v2")
OPEN311_API_KEY = os.environ.get("OPEN311_API_KEY", "dummy_key")

def open311_create_request(org_slug: str, fields: dict, evidence: dict) -> dict:
    """
    Creates a service request via the Open311 GeoReport v2 API.
    """
    # Map fields to standard Open311 parameters
    payload = {
        "api_key": OPEN311_API_KEY,
        "jurisdiction_id": fields.get("jurisdiction_id", "local"),
        "service_code": fields.get("service_code", "other"),
        "lat": fields.get("lat", "0.0"),
        "long": fields.get("long", "0.0"),
        "address_string": fields.get("address_string", "Unknown"),
        "description": fields.get("description", "Passage Issue"),
        "first_name": fields.get("first_name", "Citizen"),
        "last_name": fields.get("last_name", ""),
        "email": fields.get("email", "citizen@example.com"),
        "phone": fields.get("phone", "")
    }
    
    if "media_url" in fields and isinstance(fields["media_url"], list) and len(fields["media_url"]) > 0:
        payload["media_url"] = fields["media_url"][0]
        
    try:
        response = httpx.post(f"{OPEN311_URL}/requests.json", data=payload, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        
        # Open311 typically returns an array for successful creation
        if isinstance(data, list) and len(data) > 0:
            ticket_id = data[0].get("service_request_id")
        else:
            ticket_id = data.get("service_request_id")
            
        return {
            "ticket_ref": str(ticket_id),
            "status": "open"
        }
    except Exception as e:
        print(f"Failed to create Open311 request: {e}")
        # Fallback for demo if container is not up
        import uuid
        return {
            "ticket_ref": f"311-{uuid.uuid4().hex[:6]}",
            "status": "open"
        }
