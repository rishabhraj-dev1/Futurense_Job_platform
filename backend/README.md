# Backend API

This is the backend API built with FastAPI and SQLAlchemy.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables by copying `.env.example` to `.env` (if applicable) and configuring your database credentials.
5. Run database migrations (using Alembic):
   ```bash
   alembic upgrade head
   ```

## Running the Server

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload
```
The API documentation will be available at `http://localhost:8000/docs`.
