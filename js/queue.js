import { apiClient } from './api-client.js';
import { settingsManager } from './settings.js';
import { dbManager } from './db.js';

export class ProcessingQueue {
    constructor() {
        this.queue = [];
        this.activeCount = 0;
        this.results = new Map();
        this.isPaused = false;
        this.onProgress = null;
        this.onComplete = null;
        this.onLog = null;
    }

    log(message, type = 'info') {
        if (this.onLog) this.onLog({ message, type, timestamp: new Date() });
        console.log(`[Queue] ${message}`);
    }

    async addChunks(fileId, chunks) {
        this.queue = chunks.map(chunk => ({
            ...chunk,
            fileId,
            status: 'pending',
            attempts: 0,
            currentKeyIndex: 0, // 0 = Primary, 1 = Backup
            currentModelIndex: 0 // Index in available models list
        }));
        this.totalChunks = chunks.length;
        this.processedChunks = 0;
        this.log(`Added ${chunks.length} chunks to queue.`);
    }

    start() {
        this.isPaused = false;
        this.processQueue();
    }

    pause() {
        this.isPaused = true;
        this.log('Queue paused.');
    }

    resume() {
        this.isPaused = false;
        this.processQueue();
    }

    cancel() {
        this.queue = [];
        this.activeCount = 0;
        this.isPaused = false;
        this.log('Queue cancelled.');
    }

    async processQueue() {
        if (this.isPaused) return;

        const settings = settingsManager.settings;
        const maxConcurrency = settings.turboMode ? (settings.maxParallelChunks || 3) : 1;

        while (this.activeCount < maxConcurrency && this.queue.length > 0) {
            const item = this.queue.shift();
            this.activeCount++;
            this.processItem(item).then(() => {
                this.activeCount--;
                this.processQueue();
            });
        }

        if (this.activeCount === 0 && this.queue.length === 0) {
            if (this.onComplete) this.onComplete(Array.from(this.results.values()));
        }
    }

    async processItem(item) {
        if (this.isPaused) {
            this.queue.unshift(item); // Put back
            return;
        }

        const settings = settingsManager.settings;

        // Determine Key and Model
        let apiKey = item.currentKeyIndex === 0 ? settings.apiKey : settings.backupApiKey;
        if (!apiKey && item.currentKeyIndex === 1) {
            // No backup key, revert to primary or fail?
            // If we switched to backup but it's empty, try next model with primary key
            item.currentKeyIndex = 0;
            item.currentModelIndex++;
            apiKey = settings.apiKey;
        }

        // Fallback models list (simplified for now, could be in settings)
        const models = [settings.primaryModel, 'gemini-1.5-pro', 'gemini-1.5-flash'];
        let model = models[item.currentModelIndex] || models[0];

        if (item.currentModelIndex >= models.length) {
            this.log(`Failed to process chunk ${item.index} after trying all models.`, 'error');
            item.status = 'failed';
            this.results.set(item.index, { ...item, error: 'All models failed' });
            this.processedChunks++;
            this.updateProgress();
            return;
        }

        this.log(`Processing Chunk ${item.index + 1}/${this.totalChunks} with ${model}...`);

        try {
            const prompt = `${settings.transformPrompt}\n\nText:\n${item.text}`;
            const resultText = await apiClient.generateContent(apiKey, model, prompt, settings.systemPrompt);

            item.status = 'completed';
            item.result = resultText;
            this.results.set(item.index, item);

            // Save to DB
            await dbManager.saveChunk(item);

            this.processedChunks++;
            this.updateProgress();

        } catch (error) {
            this.log(`Error processing chunk ${item.index}: ${error.message}`, 'warning');

            // Retry Logic
            if (error.message.includes('429') || error.message.includes('503')) {
                // Rate limit or Server Error -> Wait and Retry
                await new Promise(resolve => setTimeout(resolve, 2000 * (item.attempts + 1)));
                item.attempts++;
                if (item.attempts > 3) {
                    // Switch Key or Model
                    this.handleFailover(item);
                } else {
                    this.queue.push(item); // Re-queue
                }
            } else {
                // Other error -> Failover immediately
                this.handleFailover(item);
            }
        }
    }

    handleFailover(item) {
        const settings = settingsManager.settings;

        if (item.currentKeyIndex === 0 && settings.backupApiKey) {
            this.log(`Switching to Backup API Key for chunk ${item.index}`);
            item.currentKeyIndex = 1;
            item.attempts = 0;
        } else {
            this.log(`Switching to next model for chunk ${item.index}`);
            item.currentKeyIndex = 0; // Reset to primary key for new model
            item.currentModelIndex++;
            item.attempts = 0;
        }
        this.queue.push(item);
    }

    updateProgress() {
        if (this.onProgress) {
            const percent = Math.round((this.processedChunks / this.totalChunks) * 100);
            this.onProgress(percent, this.processedChunks, this.totalChunks);
        }
    }
}

export const processingQueue = new ProcessingQueue();
