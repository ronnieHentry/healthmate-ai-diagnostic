import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

export const downloadPDF = (reportRef, sessionId) => {
  setTimeout(() => {
    const element = reportRef.current;
    if (!element) return;

    // Use dom-to-image to generate an image of the DOM element
    domtoimage.toPng(element)
      .then((dataUrl) => {
        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Add the generated image to the PDF
        doc.addImage(dataUrl, 'PNG', 10, 10, 180, 160); // Adjust dimensions as needed

        // Save the PDF with a filename that includes the sessionId
        doc.save(`diagnosis-report-${sessionId}.pdf`);
      })
      .catch((error) => {
        console.error('Error generating image from DOM:', error);
      });
  }, 2000); // Ensure that the layout is fully flushed before generating the PDF
};
