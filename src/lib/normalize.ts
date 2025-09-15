export function normalizePersonName(name: string): {
  primary: string;
  particle?: string;
  display: string;
  sortKey: string;
} {
  // Handle "(gebore SURNAME)" pattern
  const geboreMatch = name.match(/^(.+?)\s*\(gebore\s+(.+?)\)$/i);
  if (geboreMatch) {
    const [, givenNames, maidenName] = geboreMatch;
    return {
      primary: `${givenNames.trim()} ${maidenName.trim()}`,
      display: `${givenNames.trim()} ${maidenName.trim()}`,
      sortKey: `${maidenName.trim()}, ${givenNames.trim()}`
    };
  }

  // Handle particles like "van der", "van", "de", etc.
  const particles = ['van der', 'van den', 'van', 'de', 'du', 'le', 'la'];
  const nameParts = name.trim().split(/\s+/);
  
  if (nameParts.length >= 3) {
    for (const particle of particles) {
      const particleParts = particle.split(' ');
      if (nameParts.length >= particleParts.length + 2) {
        const startIdx = nameParts.length - particleParts.length - 1;
        const potentialParticle = nameParts.slice(startIdx, startIdx + particleParts.length).join(' ').toLowerCase();
        
        if (potentialParticle === particle) {
          const givenNames = nameParts.slice(0, startIdx).join(' ');
          const surname = nameParts[nameParts.length - 1];
          
          return {
            primary: name.trim(),
            particle: particle,
            display: name.trim(),
            sortKey: `${surname}, ${particle}, ${givenNames}`
          };
        }
      }
    }
  }

  // Default case - no particles
  if (nameParts.length >= 2) {
    const givenNames = nameParts.slice(0, -1).join(' ');
    const surname = nameParts[nameParts.length - 1];
    
    return {
      primary: name.trim(),
      display: name.trim(),
      sortKey: `${surname}, ${givenNames}`
    };
  }

  return {
    primary: name.trim(),
    display: name.trim(),
    sortKey: name.trim()
  };
}

export function normalizeDate(dateStr: string): string {
  // Handle various date formats and return ISO format
  if (!dateStr) return '';
  
  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Handle "9 April 1960" format
  const longDateMatch = dateStr.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (longDateMatch) {
    const [, day, month, year] = longDateMatch;
    const monthMap: Record<string, string> = {
      'january': '01', 'januarie': '01',
      'february': '02', 'februarie': '02',
      'march': '03', 'maart': '03',
      'april': '04', 'april': '04',
      'may': '05', 'mei': '05',
      'june': '06', 'junie': '06',
      'july': '07', 'julie': '07',
      'august': '08', 'augustus': '08',
      'september': '09', 'september': '09',
      'october': '10', 'oktober': '10',
      'november': '11', 'november': '11',
      'december': '12', 'desember': '12'
    };
    
    const monthNum = monthMap[month.toLowerCase()];
    if (monthNum) {
      return `${year}-${monthNum}-${day.padStart(2, '0')}`;
    }
  }
  
  // Handle "09-04-1960" format
  const shortDateMatch = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (shortDateMatch) {
    const [, day, month, year] = shortDateMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return dateStr; // Return as-is if can't parse
}