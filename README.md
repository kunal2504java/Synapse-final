# Synapse Retail Dashboard

This project is a full-stack web application for visualizing and simulating retail data. It features a React-based frontend and a Python FastAPI backend.

## Project Architecture

The project is divided into two main components:

- **`frontend`**: A modern web application built with React, Vite, and TypeScript. It uses Tailwind CSS for styling and includes libraries for mapping (Mapbox GL), charting (Recharts), and 3D graphics (Three.js).
- **`backend`**: A high-performance API built with FastAPI. It uses MongoDB as its database via the Beanie ODM and Motor driver.

### Technologies Used

**Frontend:**
- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Mapping:** Mapbox GL
- **Charting:** Recharts
- **3D Graphics:** React Three Fiber, Drei, Three.js

**Backend:**
- **Framework:** FastAPI
- **Language:** Python
- **Database:** MongoDB
- **ODM:** Beanie
- **Async Driver:** Motor
- **Server:** Uvicorn

## Getting Started

### Prerequisites

- Node.js and npm (for the frontend)
- Python and pip (for the backend)
- A running MongoDB instance

### Installation and Setup

**1. Clone the repository:**

```bash
git clone <repository-url>
cd <repository-folder>
```

**2. Set up the Backend:**

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Create a .env file from the example
cp .env.example .env
```

Next, open the `.env` file and add your MongoDB connection string:

```env
MONGO_URI=mongodb://user:password@host:port/your_database_name
```

**3. Set up the Frontend:**

```bash
cd ../frontend

# Install dependencies
npm install
```

### Running the Application

**1. Run the Backend:**

Make sure you are in the `backend` directory with the virtual environment activated.

```bash
# The backend will be available at http://127.0.0.1:8000
uvicorn app.main:app --reload
```

**2. Run the Frontend:**

In a new terminal, navigate to the `frontend` directory.

```bash
# The frontend development server will start
npm run dev
```

You can now access the application in your browser at the address provided by Vite (usually `http://localhost:5173`).

## Available Scripts

### Frontend (`package.json`)

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the source code.
- `npm run preview`: Previews the production build locally.
