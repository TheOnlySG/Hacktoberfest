# Third-Party Licenses & Architecture Compliance

Passage is built entirely on open-source technologies and open standards. 

## Core Application (Apache 2.0)
The Passage backend, protocol schemas, and core routing engine are licensed under Apache 2.0.

### Dependencies
- **FastAPI**: MIT License
- **SQLAlchemy**: MIT License
- **Pydantic**: MIT License
- **Jinja2**: BSD-3-Clause
- **WeasyPrint**: BSD License
- **APScheduler**: MIT License

## External Services & Hackathon Compliance

To comply with the hackathon's requirement of using robust open-source software without violating copyleft licenses, we utilize an adapter pattern.

### Zammad (AGPL v3)
Zammad is used as the fictional "Northfield Bank" helpdesk.
- **Compliance:** Zammad runs as a completely independent service in its own Docker container. Passage communicates with Zammad strictly over HTTP via its standard REST API. Passage does not link against, embed, or modify Zammad source code. This satisfies the AGPL v3 requirements while keeping Passage Apache 2.0.

### FixMyStreet (AGPL v3)
FixMyStreet is used as the fictional "Municipal Water Dept" platform.
- **Compliance:** Like Zammad, FixMyStreet runs as an independent service in its own Docker container. Passage communicates with it over HTTP using the open standard **Open311 GeoReport v2** API. 

### Mailpit (MIT)
Mailpit is used to capture outbound emails for demo purposes. It runs as a separate container and is communicated with via SMTP (Port 1025).

## AI and Inference
- **Groq Python SDK**: Apache 2.0
- **Llama 3.3 70B**: Llama 3.3 Community License (Open-weight)
- **Gemma 2 9B**: Apache 2.0 (Open-weight)

*Note: While the model weights are open, the inference infrastructure (Groq API) is a proprietary cloud service. This is clearly disclosed in our project badge: "Powered by open-weight model via Groq".*
