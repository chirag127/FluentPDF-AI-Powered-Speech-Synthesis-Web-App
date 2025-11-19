# Implementation Plan - Convert to Readable Spokable PDF

## Goal
Build a client-side web application to convert PDFs into a spoken-friendly format using Gemini API (REST).

## Architecture
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+ modules).
- **Storage**: `localStorage` for settings (API keys, models), `IndexedDB` for file data (PDFs) and processing state (chunks).
- **API**: Direct `fetch` calls to Google Gemini REST API (`https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`).
- **PDF Processing**: `pdfjs-dist` for reading/extraction, `jspdf` (or `pdf-lib`) for writing.

## Components

### 1. File Handling (`js/pdf-parser.js`, `js/db.js`)
- **Input**: Drag & Drop interface, File Picker.
- **Storage**: Store raw PDF ArrayBuffer in IndexedDB (`files` store) to allow offline resume.
- **Parsing**: Use `pdfjs-dist` to extract text items.
- **Multimodal**: Capture figures/images from PDF pages for multimodal description if enabled.

### 2. Text Processing (`js/chunker.js`)
- **Tokenization**: Estimate token counts (approx 4 chars/token or simple whitespace split).
- **Chunking**: Split text into chunks (configurable, e.g., 4000 tokens) with overlap (e.g., 200 tokens).
- **Strategy**: Respect paragraph boundaries.

### 3. API Client (`js/api-client.js`, `js/queue.js`)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Auth**: `x-goog-api-key` header.
- **Turbo Mode**: Implement a queue with concurrency limit (configurable).
- **Retry**: Exponential backoff for 429/5xx errors.
- **Failover**:
    1. Try Primary Key + Primary Model.
    2. If 429/5xx, retry with backoff.
    3. If max retries reached or specific error, switch to Backup Key (if available).
    4. If still failing, switch to next Model in fallback list.

### 4. UI/UX (`js/ui.js`, `js/settings.js`)
- **Settings**:
    - API Keys (Primary, Backup).
    - Models (Aliases: `gemini-2.0-flash`, `gemini-1.5-pro`, etc.).
    - Prompts (System, Transformation, Code, Table, etc. - editable).
    - Parameters (Temperature, Max Tokens).
    - Turbo Mode (Parallelism level).
- **Progress**: Visual progress bar (Stages: Uploading, Extracting, Chunking, Processing X/Y, Reassembling).
- **Logs**: Live log console (collapsible).
- **Theme**: Light/Dark toggle.

### 5. Output Generation (`js/pdf-generator.js`)
- **Reassembly**: Stitch transformed text chunks.
- **Formatting**: Create a clean PDF with simple formatting (headers, paragraphs).
- **Options**: Font size, margins, TOC, Split per chapter.

### 6. Voice/TTS (`js/tts.js`)
- **Player**: In-browser TTS using `window.speechSynthesis` or simple audio player if generating audio files.
- **Navigation**: Play/Pause, Seek by paragraph.

## External Libraries (via CDN)
- `pdfjs-dist`: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
- `jspdf`: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
- `idb`: `https://cdn.jsdelivr.net/npm/idb@8/build/index.js`

## Step-by-Step Implementation
1.  **Scaffold**: Create files and folders.
2.  **Settings**: Implement settings storage and UI (API Key, Model selection).
3.  **PDF Input**: Implement file picker, IndexedDB storage, and text extraction.
4.  **Chunking**: Implement text splitting logic.
5.  **API Client**: Implement `generateContent` call with error handling and failover.
6.  **Queue/Turbo**: Implement the processing queue.
7.  **Output**: Implement PDF generation.
8.  **Voice**: Implement TTS player.
9.  **Polish**: Styling, Dark Mode, Onboarding.
