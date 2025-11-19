export class APIClient {
    constructor() {
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    }

    async generateContent(apiKey, model, prompt, systemInstruction = '') {
        const url = `${this.baseUrl}/${model}:generateContent?key=${apiKey}`;

        const contents = [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ];

        const body = {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
            }
        };

        if (systemInstruction) {
            body.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                return data.candidates[0].content.parts.map(p => p.text).join('');
            } else {
                throw new Error('No content generated');
            }

        } catch (error) {
            console.error('Gemini API Call Failed:', error);
            throw error;
        }
    }
}

export const apiClient = new APIClient();
