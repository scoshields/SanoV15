import { SESSION_SECTIONS, ASSESSMENT_SECTIONS } from './constants';

function standardizeLineBreaks(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatSectionHeader(header: string): string {
  return `\n\n${header}:\n\n`;
}

function formatSection(section: string): string {
  return section
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\[\s*|\s*\]/g, '');
}

export function formatResponse(content: string, isAssessment: boolean): string {
  let formattedContent = standardizeLineBreaks(content);
  const sections = isAssessment ? ASSESSMENT_SECTIONS : SESSION_SECTIONS;
  let result = '';

  // Format each section with proper spacing
  sections.forEach(sectionHeader => {
    const sectionRegex = new RegExp(
      `${sectionHeader}:([^]*?)(?=${sections.map(s => `${s}:`).join('|')}|$)`,
      'i'
    );

    const match = formattedContent.match(sectionRegex);
    if (match) {
      const sectionContent = formatSection(match[1]);
      result += formatSectionHeader(sectionHeader) + sectionContent;
    }
  });

  // Clean up any excessive newlines and ensure proper spacing
  result = result
    .trim()
    .replace(/\n{3,}/g, '\n\n');

  return result;
}