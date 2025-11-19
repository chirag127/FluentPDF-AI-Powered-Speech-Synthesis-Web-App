export const DEFAULT_SETTINGS = {
    apiKey: '',
    backupApiKey: '',
    primaryModel: 'gemini-2.0-flash',
    turboMode: true,
    maxParallelChunks: 3,
    systemPrompt: `You are an expert document accessibility assistant. Your goal is to convert technical PDF content into a natural, spoken-friendly format optimized for Text-to-Speech (TTS) engines and human listeners.

Rules:
1. **Code**: Do not read code character-by-character. Instead, describe the intent, logic, and behavior of the code block in plain English.
2. **Tables**: Convert tables into narrative sentences. Explain the structure and the data trends or key values.
3. **Figures/Images**: Provide descriptive alt-text style narratives explaining the visual content.
4. **Math**: Convert mathematical notation into spoken form (e.g., "x squared" instead of "x^2").
5. **Structure**: Maintain the logical flow of the document. Use clear transition words.
6. **Citations**: Remove inline citations (e.g., [1], (Smith 2020)) to improve flow.
7. **Tone**: Professional, clear, and engaging.`,
    transformPrompt: `Convert the following text chunk into a spoken-friendly format following the system rules. Keep the same heading structure but rewrite the body text to be optimized for listening.`,
    theme: 'light'
};

export class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.applyTheme();
    }

    loadSettings() {
        const stored = localStorage.getItem('rsp_settings');
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('rsp_settings', JSON.stringify(this.settings));
        this.applyTheme();
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('settings-updated', { detail: this.settings }));
    }

    get(key) {
        return this.settings[key];
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
    }

    clearData() {
        localStorage.removeItem('rsp_settings');
        this.settings = { ...DEFAULT_SETTINGS };
        this.applyTheme();
        window.dispatchEvent(new CustomEvent('settings-cleared'));
    }
}

export const settingsManager = new SettingsManager();
