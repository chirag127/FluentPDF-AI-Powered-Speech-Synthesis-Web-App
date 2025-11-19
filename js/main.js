import { settingsManager } from './settings.js';
import { dbManager } from './db.js';
import { pdfParser } from './pdf-parser.js';
import { chunker } from './chunker.js';
import { processingQueue } from './queue.js';
import { pdfGenerator } from './pdf-generator.js';
import { ttsPlayer } from './tts.js';

class App {
    constructor() {
        this.initUI();
        this.bindEvents();
        this.currentFileId = null;
        this.processedChunks = [];
    }

    initUI() {
        // Theme
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const current = settingsManager.get('theme');
            const next = current === 'light' ? 'dark' : 'light';
            settingsManager.saveSettings({ theme: next });
        });

        // Settings Modal
        const modal = document.getElementById('settings-modal');
        document.getElementById('settings-btn').addEventListener('click', () => modal.classList.remove('hidden'));
        document.getElementById('close-settings').addEventListener('click', () => modal.classList.add('hidden'));

        // Load Settings into UI
        this.loadSettingsToUI();
    }

    loadSettingsToUI() {
        const s = settingsManager.settings;
        document.getElementById('api-key').value = s.apiKey || '';
        document.getElementById('backup-api-key').value = s.backupApiKey || '';
        document.getElementById('model-select').value = s.primaryModel;
        document.getElementById('turbo-mode').checked = s.turboMode;
        document.getElementById('system-prompt').value = s.systemPrompt;
        document.getElementById('transform-prompt').value = s.transformPrompt;
    }

    saveSettingsFromUI() {
        settingsManager.saveSettings({
            apiKey: document.getElementById('api-key').value,
            backupApiKey: document.getElementById('backup-api-key').value,
            primaryModel: document.getElementById('model-select').value,
            turboMode: document.getElementById('turbo-mode').checked,
            systemPrompt: document.getElementById('system-prompt').value,
            transformPrompt: document.getElementById('transform-prompt').value,
        });
    }

    bindEvents() {
        // Save settings on change
        ['api-key', 'backup-api-key', 'model-select', 'turbo-mode', 'system-prompt', 'transform-prompt']
            .forEach(id => {
                document.getElementById(id).addEventListener('change', () => this.saveSettingsFromUI());
            });

        document.getElementById('clear-data-btn').addEventListener('click', async () => {
            if (confirm('Are you sure? This will delete all saved files and settings.')) {
                await dbManager.clearAll();
                settingsManager.clearData();
                location.reload();
            }
        });

        // File Input
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');

        document.getElementById('browse-btn').addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Controls
        document.getElementById('pause-btn').addEventListener('click', () => processingQueue.pause());
        document.getElementById('cancel-btn').addEventListener('click', () => processingQueue.cancel());
        document.getElementById('download-partial-btn').addEventListener('click', () => this.downloadResult());
        document.getElementById('download-pdf-btn').addEventListener('click', () => this.downloadResult());

        // TTS
        document.getElementById('tts-play-btn').addEventListener('click', () => {
            document.getElementById('tts-player').classList.remove('hidden');
            ttsPlayer.loadText(this.processedChunks);
            ttsPlayer.play();
        });
        document.getElementById('tts-play-pause').addEventListener('click', () => ttsPlayer.play()); // Toggle logic in player
        document.getElementById('tts-next').addEventListener('click', () => ttsPlayer.next());
        document.getElementById('tts-prev').addEventListener('click', () => ttsPlayer.prev());

        // Queue Callbacks
        processingQueue.onLog = (log) => this.addLog(log.message, log.type);
        processingQueue.onProgress = (percent, current, total) => this.updateProgress(percent, current, total);
        processingQueue.onComplete = (results) => this.handleComplete(results);

        ttsPlayer.onStatusChange = (status, isPlaying) => {
            document.getElementById('tts-status').textContent = status;
            document.getElementById('tts-play-pause').textContent = isPlaying ? '⏸' : '▶';
        };
    }

    async handleFiles(files) {
        if (files.length === 0) return;

        const file = files[0]; // Single file for now
        this.addLog(`Selected file: ${file.name}`);

        // Check API Key
        if (!settingsManager.get('apiKey')) {
            alert('Please enter your Google AI Studio API Key in Settings first.');
            document.getElementById('settings-modal').classList.remove('hidden');
            return;
        }

        try {
            // UI Update
            document.getElementById('upload-section').classList.add('hidden');
            document.getElementById('progress-section').classList.remove('hidden');
            this.updateStage('Reading PDF...');

            // Read File
            const arrayBuffer = await file.arrayBuffer();

            // Save to DB
            const fileId = Date.now(); // Simple ID
            this.currentFileId = fileId;
            await dbManager.saveFile({ id: fileId, name: file.name, data: arrayBuffer });

            // Extract Text
            this.updateStage('Extracting Text...');
            const { text, pageCount } = await pdfParser.extractText(arrayBuffer);
            this.addLog(`Extracted text from ${pageCount} pages.`);

            // Chunking
            this.updateStage('Chunking Text...');
            const chunks = chunker.chunkText(text);
            this.addLog(`Created ${chunks.length} chunks.`);

            // Start Processing
            this.updateStage('Processing with Gemini...');
            processingQueue.addChunks(fileId, chunks);
            processingQueue.start();

        } catch (error) {
            this.addLog(`Error: ${error.message}`, 'error');
            alert('Error processing file: ' + error.message);
        }
    }

    updateStage(stage) {
        document.getElementById('progress-stage').textContent = stage;
    }

    updateProgress(percent, current, total) {
        document.getElementById('progress-percent').textContent = `${percent}%`;
        document.getElementById('progress-bar').style.width = `${percent}%`;
        this.updateStage(`Processing chunk ${current}/${total}`);
    }

    addLog(message, type = 'info') {
        const logDiv = document.getElementById('log-content');
        const entry = document.createElement('div');
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        entry.style.color = type === 'error' ? 'var(--danger-color)' : type === 'warning' ? 'orange' : 'inherit';
        logDiv.prepend(entry);
    }

    handleComplete(results) {
        this.processedChunks = results;
        this.updateStage('Complete!');
        this.addLog('Processing complete.');
        document.getElementById('progress-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
    }

    downloadResult() {
        if (!this.processedChunks || this.processedChunks.length === 0) {
            // Try to get partial results from queue
            this.processedChunks = Array.from(processingQueue.results.values());
        }

        if (this.processedChunks.length === 0) {
            alert('No processed content available yet.');
            return;
        }

        pdfGenerator.generatePDF(this.processedChunks, 'readable_spokable_output.pdf');
    }
}

// Initialize
window.app = new App();
