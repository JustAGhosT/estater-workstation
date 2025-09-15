import JSZip from 'jszip';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { NormalizedCaseType } from './schema';
import { generateSummaryPDF } from './pdf';
import { createHash } from 'crypto';

export async function createProvpack(normalizedCase: NormalizedCaseType): Promise<Buffer> {
  const zip = new JSZip();
  
  // Add case.json
  const caseJson = JSON.stringify(normalizedCase, null, 2);
  zip.file('case.json', caseJson);
  
  // Add pages (mock images)
  const pagesFolder = zip.folder('pages');
  if (pagesFolder) {
    try {
      for (let i = 1; i <= 3; i++) {
        const imagePath = join(process.cwd(), 'public', 'mock', 'pages', `000${i}.jpg`);
        try {
          const imageBuffer = await readFile(imagePath);
          pagesFolder.file(`000${i}.jpg`, imageBuffer);
        } catch (error) {
          console.warn(`Could not read image ${imagePath}:`, error);
          // Create a placeholder if image doesn't exist
          pagesFolder.file(`000${i}.jpg`, Buffer.from('placeholder'));
        }
      }
    } catch (error) {
      console.warn('Error adding page images:', error);
    }
  }
  
  // Generate and add summary.pdf
  try {
    const summaryPdf = await generateSummaryPDF(normalizedCase);
    zip.file('summary.pdf', summaryPdf);
  } catch (error) {
    console.warn('Error generating PDF:', error);
    zip.file('summary.pdf', Buffer.from('PDF generation failed'));
  }
  
  // Create manifest.json
  const manifest = {
    version: '1.0',
    caseId: normalizedCase.caseId,
    packetId: normalizedCase.packetId,
    createdAt: new Date().toISOString(),
    files: {
      'case.json': createHash('sha256').update(caseJson).digest('hex'),
      'summary.pdf': 'generated',
      'pages/': 'mock-images'
    },
    schema: {
      case: 'NormalizedCase-v1.0',
      citations: 'Citation-v1.0'
    }
  };
  
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  
  return zip.generateAsync({ type: 'nodebuffer' });
}