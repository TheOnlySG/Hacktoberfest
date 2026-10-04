# Passage v2.0 (Stream B)

This repository contains the backend and AI infrastructure for the Passage resolution workflow.

## Local Setup Instructions

To run the Python code locally and test the AI pipeline, follow these steps:

### 1. Create a Virtual Environment
Navigate to the root of this project and create a Python virtual environment:
```bash
python3 -m venv venv
```

### 2. Activate the Virtual Environment
Activate it so your terminal uses the local Python and pip:
- On Linux/macOS:
  ```bash
  source venv/bin/activate
  ```
- On Windows:
  ```bash
  .\venv\Scripts\activate
  ```

### 3. Install Dependencies
Install the required packages from the backend's requirements file:
```bash
pip install -r backend/requirements.txt
```

### 4. Run the Pipeline Test Script
You can test the core Python logic without starting the server:
```bash
python test_workflow.py
```

### 5. Run the FastAPI Server
To run the web server locally and view the interactive API documentation:
```bash
# Set PYTHONPATH so it can find the backend module
PYTHONPATH=. uvicorn backend.main:app --reload
```
Once the server is running, open your browser to **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** to view the Swagger UI.

---

## Running with Docker (Full Environment)

If you have Docker installed, you can spin up the full backend, including our local Mailpit server (for capturing emails) and the FastAPI server.

```bash
docker-compose up --build
```

- **FastAPI Backend:** `http://localhost:8000`
- **Mailpit Web UI (Email capture):** `http://localhost:8025`
