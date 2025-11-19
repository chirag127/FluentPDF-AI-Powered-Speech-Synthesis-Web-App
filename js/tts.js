export class TTSPlayer {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.chunks = [];
        this.currentChunkIndex = 0;
        this.onStatusChange = null;
    }

    loadText(chunks) {
        this.chunks = chunks.sort((a, b) => a.index - b.index);
        this.currentChunkIndex = 0;
    }

    play() {
        if (this.synth.paused) {
            this.synth.resume();
            this.isPlaying = true;
            this.updateStatus();
            return;
        }

        if (this.synth.speaking) {
            return; // Already playing
        }

        this.speakChunk();
    }

    speakChunk() {
        if (this.currentChunkIndex >= this.chunks.length) {
            this.isPlaying = false;
            this.updateStatus('Finished');
            return;
        }

        const text = this.chunks[this.currentChunkIndex].result;
        this.utterance = new SpeechSynthesisUtterance(text);

        this.utterance.onend = () => {
            this.currentChunkIndex++;
            this.speakChunk();
        };

        this.utterance.onerror = (e) => {
            console.error('TTS Error:', e);
            this.isPlaying = false;
            this.updateStatus('Error');
        };

        this.synth.speak(this.utterance);
        this.isPlaying = true;
        this.updateStatus();
    }

    pause() {
        this.synth.pause();
        this.isPlaying = false;
        this.updateStatus();
    }

    next() {
        this.synth.cancel();
        this.currentChunkIndex++;
        if (this.currentChunkIndex >= this.chunks.length) this.currentChunkIndex = 0; // Loop or stop? Stop preferred usually.
        this.speakChunk();
    }

    prev() {
        this.synth.cancel();
        this.currentChunkIndex--;
        if (this.currentChunkIndex < 0) this.currentChunkIndex = 0;
        this.speakChunk();
    }

    updateStatus(msg) {
        if (this.onStatusChange) {
            const status = msg || (this.isPlaying ? `Playing chunk ${this.currentChunkIndex + 1}/${this.chunks.length}` : 'Paused');
            this.onStatusChange(status, this.isPlaying);
        }
    }
}

export const ttsPlayer = new TTSPlayer();
