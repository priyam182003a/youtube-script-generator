FROM python:3.12-slim

# Avoid signature errors by skipping key checks for local build (DEV SAFE)
RUN apt-get update --allow-releaseinfo-change && \
    apt-get install -y --no-install-recommends ffmpeg build-essential git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
