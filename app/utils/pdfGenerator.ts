import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate and download a PDF from an HTML element
 * @param elementId - The ID of the HTML element to convert to PDF
 * @param filename - The name of the PDF file (without extension)
 * @param options - Optional configuration for PDF generation
 */
export const generatePDF = async (
  elementId: string,
  filename: string,
  options?: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    quality?: number;
  }
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Default options
    const config = {
      orientation: options?.orientation || 'portrait',
      format: options?.format || 'a4',
      quality: options?.quality || 2,
    };

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: config.quality,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions
    const imgWidth = config.format === 'a4' ? 210 : 215.9; // mm (A4 or Letter)
    const pageHeight = config.format === 'a4' ? 297 : 279.4; // mm (A4 or Letter)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: config.format,
    });

    let position = 0;

    // Add image to PDF (handle multiple pages if needed)
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate PDF with custom styling for print
 * Temporarily applies print-specific styles before generating PDF
 */
export const generateStyledPDF = async (
  elementId: string,
  filename: string,
  options?: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    quality?: number;
  }
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  // Store original styles
  const originalDisplay = element.style.display;
  const originalMaxWidth = element.style.maxWidth;

  try {
    // Apply print-friendly styles
    element.style.display = 'block';
    element.style.maxWidth = '100%';

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Generate PDF
    await generatePDF(elementId, filename, options);
  } finally {
    // Restore original styles
    element.style.display = originalDisplay;
    element.style.maxWidth = originalMaxWidth;
  }
};

