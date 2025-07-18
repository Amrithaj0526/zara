# Use official Python 3.12 image
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libmariadb-dev pkg-config libjpeg-dev zlib1g-dev libpng-dev libfreetype6-dev libopenjp2-7-dev libtiff-dev && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY app/backend/requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend code (preserve app/ package structure)
COPY app/ app/

# Set environment variables
ENV FLASK_APP=main.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=production

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "-m", "app.backend.main"] 