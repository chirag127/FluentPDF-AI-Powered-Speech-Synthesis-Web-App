# Convert to Readable Spokable PDF

A modern, client-side web application that converts PDFs into a natural, spoken-friendly format using Google Gemini AI. Optimized for Text-to-Speech (TTS) consumption.

## Features

- **AI-Powered Transformation**: Converts code, tables, figures, and math into descriptive natural language.
- **Client-Side Only**: No server required. Runs entirely in the browser.
- **Turbo Mode**: Parallel chunk processing for faster conversion.
- **Offline Support**: Saves progress and files using IndexedDB.
- **In-Browser TTS**: Listen to the generated text directly in the app.
- **Customizable**: Configurable prompts, models, and PDF output settings.

## Quick Start

1. Open `index.html` in a modern web browser.
2. Click **Settings** and enter your [Google AI Studio API Key](https://aistudio.google.com/app/apikey).
3. Drag and drop a PDF file to start.

## Developer Guide

### Project Structure

- `index.html`: Main application entry point.
- `js/`: JavaScript modules.
    - `main.js`: Application logic and UI orchestration.
    - `api-client.js`: Gemini REST API client.
    - `chunker.js`: Text splitting logic.
    - `pdf-parser.js`: PDF text extraction (via PDF.js).
    - `queue.js`: Processing queue and concurrency manager.
    - `settings.js`: LocalStorage manager.
    - `db.js`: IndexedDB wrapper.
    - `tts.js`: Text-to-Speech player.
    - `pdf-generator.js`: PDF creation (via jsPDF).
- `css/`: Stylesheets (Vanilla CSS with variables).

### Configuration

- **Models**: Update `js/settings.js` or the Settings UI to change available models.
- **Prompts**: Edit default prompts in `js/settings.js`.

### Deployment

**Option 1: Static Server (Recommended)**
Host the files on any static file server (GitHub Pages, Netlify, Vercel, or local Apache/Nginx).
If running locally, use a simple server:
```bash
npx http-server .
```
Then open `http://localhost:8080`.

**Option 2: Local File (No Server)**
If you want to run the app directly by double-clicking a file (without a server), use **`index_bundled.html`**.
This file contains all scripts and styles inline to avoid browser security restrictions on local files.

## License

MIT
