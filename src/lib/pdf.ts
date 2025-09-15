import puppeteer from 'puppeteer';
import { NormalizedCaseType } from './schema';

export async function generateSummaryPDF(normalizedCase: NormalizedCaseType): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const deceased = normalizedCase.persons.find(p => 
    normalizedCase.events.some(e => 
      e.type === 'Death' && e.participants.some(part => part.personId === p.id)
    )
  );
  
  const children = normalizedCase.persons.filter(p => 
    normalizedCase.relationships.some(r => 
      r.type === 'parentOf' && r.toId === p.id && r.fromId === deceased?.id
    )
  );

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Estate Summary - ${deceased?.primaryName || 'Unknown'}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .field { margin: 8px 0; }
        .field strong { display: inline-block; width: 120px; }
        .children { margin-left: 20px; }
        .child { margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 3px solid #007acc; }
        .sources { font-size: 0.9em; color: #666; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 0.8em; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Estate Research Summary</h1>
        <p><strong>Case ID:</strong> ${normalizedCase.caseId}</p>
        <p><strong>Packet:</strong> ${normalizedCase.packetId}</p>
        <p><strong>Generated:</strong> ${new Date().toISOString().split('T')[0]}</p>
      </div>

      <div class="section">
        <h2>Deceased Person</h2>
        ${deceased ? `
          <div class="field"><strong>Name:</strong> ${deceased.primaryName}</div>
          <div class="field"><strong>Death Date:</strong> ${deceased.deathDate || 'Unknown'}</div>
          <div class="field"><strong>Death Place:</strong> ${deceased.deathPlace || 'Unknown'}</div>
          <div class="field"><strong>Gender:</strong> ${deceased.gender || 'Unknown'}</div>
        ` : '<p>No deceased person information available</p>'}
      </div>

      <div class="section">
        <h2>Children (${children.length})</h2>
        <div class="children">
          ${children.map(child => `
            <div class="child">
              <div class="field"><strong>Name:</strong> ${child.primaryName}</div>
              ${child.birthDate ? `<div class="field"><strong>Birth:</strong> ${child.birthDate}</div>` : ''}
              ${child.gender ? `<div class="field"><strong>Gender:</strong> ${child.gender}</div>` : ''}
            </div>
          `).join('')}
          ${children.length === 0 ? '<p>No children recorded</p>' : ''}
        </div>
      </div>

      <div class="section">
        <h2>Sources</h2>
        <div class="sources">
          ${normalizedCase.sources.map(source => `
            <div class="field">
              <strong>${source.repo}:</strong> ${source.title} (${source.packetId})
            </div>
          `).join('')}
        </div>
      </div>

      <div class="footer">
        <p>This summary was generated from estate file extraction with ${normalizedCase.citations.length} field citations.</p>
        <p>All data should be verified against original documents.</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
  });

  await browser.close();
  return pdf;
}