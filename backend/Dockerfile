# Use official Python slim image
FROM python:3.12-slim

WORKDIR /app

# System packages for TTS & Transformers
RUN apt-get update --allow-releaseinfo-change && \
    apt-get install -y --no-install-recommends ffmpeg build-essential git || \
    apt-get install -y --fix-missing ffmpeg build-essential git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
