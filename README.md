# HTML to PDF Converter (Dockerized & Open Source)

A modern, production-ready web app to convert HTML (with images) to PDF using a
simple upload UI. Built with Node.js and Bootstrap, and powered by the
microbox/node-url-to-pdf-api microservice.

**Docker Hub Image:**

    docker pull coderabhisek/html-to-pdf-app:latest

**GitHub Repo:**

This repo contains the full source code and a ready-to-use `docker-compose.yml`
for local or production deployment.

---

## Features

-    Upload HTML files and images
-    Preview HTML as A4 before conversion
-    Download PDF with embedded images
-    Modern, responsive UI
-    Runs as two Docker containers (your app + PDF API)

---

## Quick Start (Docker Compose)

1. **Clone this repo:**

     ```sh
     git clone https://github.com/abhisekmohantychinua/html-to-pdf.git
     cd html-to-pdf
     ```

2. **(Option 1) Use the prebuilt Docker image from Docker Hub:**

     - The included `docker-compose.yml` will use `coderabhisek/html-to-pdf-app`
       by default.
     - Just run:
          ```sh
          docker compose up -d
          ```

3. **(Option 2) Build your own image from source:**

     - Edit `docker-compose.yml` to use `build: .` instead of `image:` for the
       `app` service, or run:
          ```sh
          docker build -t my-html-to-pdf-app .
          # Then update docker-compose.yml to use your image name, or run with:
          docker run -p 3000:3000 my-html-to-pdf-app
          ```

4. **Open the app:**
     - Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

-    Upload an `.html` file and any images referenced in your HTML (by
     filename).
-    Click **Preview** to see your HTML rendered as A4.
-    Click **Convert & Download PDF** to get a PDF with all images embedded.

---

## Environment Variables

-    `PDF_API_URL` (default: `http://pdf-api:80`)
     -    Set automatically by Docker Compose for internal service
          communication.

---

## Logs & Troubleshooting

-    To see logs for your app:
     ```sh
     docker logs html-to-pdf-app
     ```
-    The app will retry connecting to the PDF API for up to 1 minute on startup.
-    All PDF API requests and errors are logged for easy debugging.

---

## Project Structure

-    `server.js` — Node.js/Express backend
-    `index.html` — Modern upload/preview UI
-    `Dockerfile` — Build your app image
-    `docker-compose.yml` — Orchestrates both services

---

## Credits

-    PDF rendering powered by
     [microbox/node-url-to-pdf-api](https://github.com/microbox/node-url-to-pdf-api)
-    UI and app by **Abhisek Mohanty**  
     [🌐 Portfolio](https://abhisekmohantychinua.github.io/mohantyabhisek.portfolio)
     &nbsp;|&nbsp; [LinkedIn](https://www.linkedin.com/in/mohanty-abhisek)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.
