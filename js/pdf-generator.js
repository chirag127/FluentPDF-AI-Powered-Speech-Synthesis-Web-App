export class PDFGenerator {
    constructor() {
        // jsPDF is available globally
    }

    async generatePDF(chunks, filename = 'output.pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxLineWidth = pageWidth - (margin * 2);

        let y = margin;

        // Title Page
        doc.setFontSize(24);
        doc.text('Readable Spokable PDF', pageWidth / 2, y + 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, y + 35, { align: 'center' });

        doc.addPage();
        y = margin;

        // Content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setLineHeightFactor(1.5);

        // Sort chunks by index just in case
        chunks.sort((a, b) => a.index - b.index);

        for (const chunk of chunks) {
            const text = chunk.result || '';
            const lines = doc.splitTextToSize(text, maxLineWidth);

            for (const line of lines) {
                if (y > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += 7; // Line height approx
            }

            // Add some spacing between chunks
            y += 10;
        }

        doc.save(filename);
    }
}

export const pdfGenerator = new PDFGenerator();
