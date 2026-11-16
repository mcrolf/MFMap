/** Parses JSON with comments and trailing commas (tsconfig.json style). Returns undefined when invalid. */
export function parseJsonc(text: string): unknown {
  try {
    return JSON.parse(stripTrailingCommas(stripComments(text)));
  } catch {
    return undefined;
  }
}

function stripComments(text: string): string {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    if (char === '"') {
      const end = endOfString(text, i);
      result += text.slice(i, end);
      i = end;
    } else if (char === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (char === '/' && text[i + 1] === '*') {
      const close = text.indexOf('*/', i + 2);
      i = close === -1 ? text.length : close + 2;
    } else {
      result += char;
      i++;
    }
  }
  return result;
}

/** Index just past the closing quote of the string starting at `start`. */
function endOfString(text: string, start: number): number {
  let i = start + 1;
  while (i < text.length && text[i] !== '"') i += text[i] === '\\' ? 2 : 1;
  return i + 1;
}

function stripTrailingCommas(text: string): string {
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '"') {
      const end = endOfString(text, i);
      result += text.slice(i, end);
      i = end;
      continue;
    }
    if (text[i] === ',') {
      let next = i + 1;
      while (/\s/.test(text[next] ?? '')) next++;
      if (text[next] === '}' || text[next] === ']') {
        i++;
        continue;
      }
    }
    result += text[i];
    i++;
  }
  return result;
}
