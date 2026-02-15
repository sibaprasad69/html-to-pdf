🔹 Project Description

This project is a Docker-based HTML to PDF Converter application that allows users to generate PDF files from HTML content in a clean, isolated, and consistent environment. Instead of running directly on the local system, the application is packaged inside a Docker container, ensuring that all dependencies, libraries, and runtime configurations are handled by the Docker Engine.

Using Docker makes the project easy to run on any system without worrying about Node.js versions, library conflicts, or OS differences. Once the container is built and started, the application processes HTML input and generates downloadable PDF files inside the container environment.

🔹 How It Works

The user starts the application using Docker Engine.

Docker builds the image containing the application and required dependencies.

A container is created and run from this image.

HTML content is processed inside the container.

The application generates a PDF file and makes it available for download.

This approach ensures portability, stability, and ease of deployment.

🔹 Features

HTML to PDF conversion

Fully Dockerized application

No local dependency installation required

Consistent behavior across different systems

Easy setup using Docker commands

🔹 Technologies Used

Docker & Docker Engine

Node.js

JavaScript

HTML

PDF generation library

🔹 Prerequisites

Docker installed on the system

Docker Engine running

Check Docker installation:

docker --version

🔹 How to Run the Project (Using Docker)

Clone the repository:

git clone https://github.com/sibaprasad69/html-to-pdf.git


Navigate to the project directory:

cd html-to-pdf


Build the Docker image:

docker build -t html-to-pdf .


Run the Docker container:

docker run -p 3000:3000 html-to-pdf


Open your browser and access:

http://localhost:3000


Upload or generate HTML and download the PDF.

🔹 Why Docker is Used

Eliminates “it works on my machine” problems

Simplifies project setup

Makes deployment easier

Ensures dependency consistency

🔹 Future Improvements

Docker Compose support

Volume mapping for PDF storage

UI improvements

Cloud deployment support
