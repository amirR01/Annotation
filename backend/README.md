# Annotation Backend

This is the backend service for the annotation application, built with FastAPI and MongoDB.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Make sure MongoDB is running locally or update the MONGODB_URL in .env

3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation

Once the server is running, visit:
- http://localhost:8000/docs for Swagger UI
- http://localhost:8000/redoc for ReDoc documentation

## API Endpoints

### Rules
- GET /api/rules - List all rules
- POST /api/rules - Create a new rule
- PUT /api/rules/{rule_id} - Update a rule
- DELETE /api/rules/{rule_id} - Delete a rule

### Annotations
- GET /api/annotations - List annotations (filter by conversation_id)
- POST /api/annotations - Create a new annotation