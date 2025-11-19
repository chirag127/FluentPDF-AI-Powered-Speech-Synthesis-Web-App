export class Chunker {
    constructor(options = {}) {
        this.maxTokens = options.maxTokens || 4000;
        this.overlapTokens = options.overlapTokens || 200;
        this.charsPerToken = 4; // Rough estimate
    }

    chunkText(text) {
        const maxChars = this.maxTokens * this.charsPerToken;
        const overlapChars = this.overlapTokens * this.charsPerToken;

        const chunks = [];
        let startIndex = 0;

        while (startIndex < text.length) {
            let endIndex = startIndex + maxChars;

            if (endIndex >= text.length) {
                endIndex = text.length;
            } else {
                // Try to find a paragraph break (double newline) near the end
                const lastDoubleNewline = text.lastIndexOf('\n\n', endIndex);
                if (lastDoubleNewline > startIndex + (maxChars * 0.5)) {
                    endIndex = lastDoubleNewline + 2; // Include the newlines
                } else {
                    // Try single newline
                    const lastNewline = text.lastIndexOf('\n', endIndex);
                    if (lastNewline > startIndex + (maxChars * 0.5)) {
                        endIndex = lastNewline + 1;
                    } else {
                        // Fallback to space
                        const lastSpace = text.lastIndexOf(' ', endIndex);
                        if (lastSpace > startIndex + (maxChars * 0.5)) {
                            endIndex = lastSpace + 1;
                        }
                    }
                }
            }

            const chunkText = text.slice(startIndex, endIndex);
            chunks.push({
                index: chunks.length,
                text: chunkText,
                start: startIndex,
                end: endIndex
            });

            if (endIndex === text.length) break;

            // Move start index for next chunk, accounting for overlap
            startIndex = endIndex - overlapChars;
            // Ensure we don't get stuck if overlap is too big or no good break point
            if (startIndex <= chunks[chunks.length - 1].start) {
                startIndex = chunks[chunks.length - 1].end;
            }
        }

        return chunks;
    }
}

export const chunker = new Chunker();
