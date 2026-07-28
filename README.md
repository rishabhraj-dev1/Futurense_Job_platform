# Project 2

This project contains a full-stack application with a FastAPI backend and a Next.js frontend.

## Structure

- `frontend/`: Next.js frontend application.
- `backend/`: FastAPI backend application.

## Prerequisites

- Node.js (for frontend)
- Python 3 (for backend)

## Getting Started

### Backend
1. Navigate to the `backend/` directory.
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. Run the backend server (typically using uvicorn):
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```

## Contributing
Please see individual directories for more detailed information.
