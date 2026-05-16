FROM python:3.10-slim
RUN apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-deu tesseract-ocr-srp
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
