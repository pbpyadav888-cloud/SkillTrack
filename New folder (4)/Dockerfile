FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY run.py .

# Environment variables
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Run server with auto-seeding
CMD ["python", "run.py"]
