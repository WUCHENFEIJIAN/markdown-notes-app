export interface EditorChange {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

const INDENT = '  ';

function lineStartAt(text: string, pos: number): number {
  return text.lastIndexOf('\n', pos - 1) + 1;
}

function lineEndAt(text: string, pos: number): number {
  const i = text.indexOf('\n', pos);
  return i === -1 ? text.length : i;
}

interface ListInfo {
  indent: string;
  bullet: string;
  type: 'ul' | 'ol';
  num: number;
  markerLen: number;
}

function matchList(line: string): ListInfo | null {
  let m = line.match(/^(\s*)([-*+])\s/);
  if (m) return { indent: m[1], bullet: m[2] + ' ', type: 'ul', num: 0, markerLen: m[0].length };
  m = line.match(/^(\s*)(\d+)\.\s/);
  if (m)
    return {
      indent: m[1],
      bullet: m[2] + '. ',
      type: 'ol',
      num: parseInt(m[2], 10),
      markerLen: m[0].length,
    };
  return null;
}

function inCodeBlock(text: string, pos: number): boolean {
  return (text.substring(0, pos).match(/```/g) || []).length % 2 === 1;
}

/** Tab / Shift+Tab：缩进与层级控制 */
export function handleTab(
  text: string,
  start: number,
  end: number,
  shift: boolean,
): EditorChange {
  const ls = lineStartAt(text, Math.min(start, end));
  const le = lineEndAt(text, Math.max(start, end));
  const multiLine = lineStartAt(text, start) !== lineStartAt(text, end);
  const hasSel = start !== end;

  if (shift) {
    const block = text.substring(ls, le);
    const newBlock = block
      .split('\n')
      .map((l) => {
        if (l.startsWith(INDENT)) return l.slice(2);
        if (l.startsWith('\t') || l.startsWith(' ')) return l.slice(1);
        return l;
      })
      .join('\n');
    return {
      text: text.slice(0, ls) + newBlock + text.slice(le),
      selectionStart: Math.max(ls, start - 2),
      selectionEnd: Math.max(ls, end - 2),
    };
  }

  if (multiLine) {
    const block = text.substring(ls, le);
    const newBlock = block
      .split('\n')
      .map((l) => INDENT + l)
      .join('\n');
    return {
      text: text.slice(0, ls) + newBlock + text.slice(le),
      selectionStart: ls,
      selectionEnd: le + 2 * block.split('\n').length,
    };
  }

  if (hasSel) {
    return {
      text: text.slice(0, start) + INDENT + text.slice(end),
      selectionStart: start + 2,
      selectionEnd: start + 2,
    };
  }

  const currentLine = text.substring(ls, le);
  if (matchList(currentLine) && !inCodeBlock(text, start)) {
    return {
      text: text.slice(0, ls) + INDENT + text.slice(ls),
      selectionStart: start + 2,
      selectionEnd: end + 2,
    };
  }

  return {
    text: text.slice(0, start) + INDENT + text.slice(end),
    selectionStart: start + 2,
    selectionEnd: start + 2,
  };
}

/** Enter：列表自动续行 / 双击退出 */
export function handleListEnter(
  text: string,
  pos: number,
): EditorChange | null {
  if (inCodeBlock(text, pos)) return null;

  const ls = lineStartAt(text, pos);
  const le = lineEndAt(text, pos);
  const line = text.substring(ls, le);
  const list = matchList(line);
  if (!list) return null;

  const remaining = line.substring(pos - ls);
  if (remaining.trim() !== '') return null;

  const content = line.substring(list.markerLen).trim();

  if (content === '') {
    const before = text.slice(0, ls);
    const after = text.slice(le);
    return {
      text: before + (after.startsWith('\n') ? after : '\n' + after),
      selectionStart: before.length,
      selectionEnd: before.length,
    };
  }

  const nextBullet =
    list.type === 'ol' ? `${list.num + 1}. ` : list.bullet;
  const insert = '\n' + list.indent + nextBullet;
  return {
    text: text.slice(0, pos) + insert + text.slice(le),
    selectionStart: pos + insert.length,
    selectionEnd: pos + insert.length,
  };
}

/** Ctrl/Cmd+B/I/K：文本快速排版 */
export function handleFormat(
  text: string,
  start: number,
  end: number,
  type: 'bold' | 'italic' | 'link',
): EditorChange {
  const sel = text.substring(start, end);

  if (type === 'bold') {
    const inner = sel || '加粗';
    return {
      text: text.slice(0, start) + `**${inner}**` + text.slice(end),
      selectionStart: start + 2,
      selectionEnd: start + 2 + inner.length,
    };
  }

  if (type === 'italic') {
    const inner = sel || '斜体';
    return {
      text: text.slice(0, start) + `*${inner}*` + text.slice(end),
      selectionStart: start + 1,
      selectionEnd: start + 1 + inner.length,
    };
  }

  const linkText = sel || '链接';
  const wrapped = `[${linkText}](url)`;
  const urlStart = start + 1 + linkText.length + 2;
  return {
    text: text.slice(0, start) + wrapped + text.slice(end),
    selectionStart: urlStart,
    selectionEnd: urlStart + 3,
  };
}
