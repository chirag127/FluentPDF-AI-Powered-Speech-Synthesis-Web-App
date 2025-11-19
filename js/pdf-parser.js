export class PDFParser {
    constructor() {
        // pdfjsLib is available globally via CDN
    }

    async extractText(arrayBuffer) {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let fullText = '';
        const pages = [];

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Simple heuristic for structure based on font height (optional improvement)
            // For now, we'll just join items with spaces/newlines
            let pageText = '';
            let lastY = -1;

            for (const item of textContent.items) {
                // Check for new line based on Y position difference
                if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
                    pageText += '\n';
                } else if (lastY !== -1) {
                    pageText += ' '; // Add space between words on same line
                }
                pageText += item.str;
                lastY = item.transform[5];
            }

            pages.push({
                pageNumber: i,
                text: pageText
            });
            fullText += pageText + '\n\n';
        }

        return {
            pageCount: numPages,
            text: fullText,
            pages: pages
        };
    }
}

export const pdfParser = new PDFParser();
