# Task List: Convert to Readable Spokable PDF

- [ ] **Project Scaffolding & Core Structure**
    - [ ] Create directory structure (`js/`, `css/`, `assets/`)
    - [ ] Create HTML pages (`index.html`, `about.html`, `privacy.html`, `faq.html`, `terms.html`, `contact.html`, `pricing.html`)
    - [ ] Setup CSS architecture (variables, dark/light theme, responsive base)
    - [ ] Create `README.md` and Developer Guide

- [ ] **Settings & Persistence Layer**
    - [ ] Implement `js/settings.js` (localStorage for API keys, models, prompts, theme)
    - [ ] Implement `js/db.js` (IndexedDB wrapper for file storage and progress persistence)
    - [ ] Build Settings UI (API Key input, Model selection, Prompts editor, PDF settings)
    - [ ] Implement Auto-save and "Clear Data" functionality

- [ ] **PDF Input & Text Extraction**
    - [ ] Implement File Input (Drag & Drop, File Picker)
    - [ ] Implement `js/pdf-parser.js` (Text extraction using PDF.js)
    - [ ] Implement Image/Figure extraction (for multimodal support)
    - [ ] Display file info and save to IndexedDB

- [ ] **Logic & API Integration**
    - [ ] Implement `js/chunker.js` (Token-aware text splitting with overlap)
    - [ ] Implement `js/api-client.js` (Gemini REST calls, `x-goog-api-key`, error handling)
    - [ ] Implement `js/queue.js` (Batch processing, Turbo Mode/Parallelism, Rate limiting)
    - [ ] Implement Model Failover & Retry Logic (Primary -> Backup Key -> Fallback Models)

- [ ] **UI & Interaction**
    - [ ] Build Main Dashboard (File list, Progress Indicator, Control buttons)
    - [ ] Implement Live Log/Console View
    - [ ] Implement "Pause/Resume" and "Cancel" functionality
    - [ ] Implement "Download Partial Result"

- [ ] **PDF Generation & Output**
    - [ ] Implement `js/pdf-generator.js` (Reassemble text, generate PDF with jsPDF/pdf-lib)
    - [ ] Implement PDF styling options (Font, Margins, TOC)
    - [ ] Implement "Split PDF per chapter" option

- [ ] **Voice & Accessibility Features**
    - [ ] Implement In-browser TTS Player ("Give your app a voice")
    - [ ] Implement Audio Navigation (Play/Pause/Seek)
    - [ ] Ensure Accessibility (ARIA, Keyboard nav)

- [ ] **Testing & Polish**
    - [ ] Create Test Page (Latency test, Sample PDFs)
    - [ ] Implement Onboarding Walkthrough
    - [ ] Verify Dark Mode & Responsive Design
    - [ ] Create Single-file build script/instruction
