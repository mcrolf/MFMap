/** Inline code span that survives backticks in the text. */
export function code(text: string): string {
  return text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``;
}

/** Joins the defined, non-empty parts with a middle dot. */
export function joinParts(parts: Array<string | undefined | false>): string {
  return parts.filter((part): part is string => Boolean(part)).join(' · ');
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** Escapes a value for one tab-separated cell. */
export function tsvCell(value: string | number | boolean | undefined): string {
  return String(value ?? '').replace(/[\t\r\n]+/g, ' ');
}

export function tsv(header: string[], rows: Array<Array<string | number | boolean | undefined>>): string {
  return `${[header, ...rows].map((row) => row.map(tsvCell).join('\t')).join('\n')}\n`;
}
