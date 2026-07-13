import type { Note } from '../types/note';

/** 把字符串里的 HTML 特殊字符转义，用于拼进新窗口的 HTML 文档 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 把标题清理成安全的文件名 */
function safeFilename(title: string): string {
  const trimmed = title.trim() || '未命名笔记';
  // 去掉 Windows / macOS / Linux 不允许的字符
  return trimmed
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, ' ')
    .slice(0, 80);
}

/** 触发浏览器下载一个文本文件 */
function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 释放 blob URL
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** 导出为 Markdown 文件 */
export function exportMarkdown(note: Note): void {
  download(`${safeFilename(note.title)}.md`, note.content, 'text/markdown;charset=utf-8');
}

/** 打印窗口里用的浅色排版样式（白底深字，适合 PDF） */
const PRINT_CSS = `
@page { margin: 18mm 16mm; }
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  background: #ffffff;
  color: #1a1a1a;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.doc-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 18px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e4e4e7;
  color: #111;
}
.markdown-body > *:first-child { margin-top: 0; }
.markdown-body > *:last-child { margin-bottom: 0; }
.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
  font-weight: 700;
  line-height: 1.3;
  margin: 1.6em 0 0.6em;
  color: #111;
  letter-spacing: -0.01em;
}
.markdown-body h1 { font-size: 1.8em; border-bottom: 2px solid #e4e4e7; padding-bottom: 0.2em; }
.markdown-body h2 { font-size: 1.45em; border-bottom: 1px solid #e4e4e7; padding-bottom: 0.15em; }
.markdown-body h3 { font-size: 1.2em; }
.markdown-body h4 { font-size: 1.05em; }
.markdown-body p { margin: 0.9em 0; }
.markdown-body a { color: #0e7490; text-decoration: underline; text-underline-offset: 2px; }
.markdown-body ul, .markdown-body ol { margin: 0.6em 0; padding-left: 1.6em; }
.markdown-body ul { list-style: disc; }
.markdown-body ol { list-style: decimal; }
.markdown-body li { margin: 0.25em 0; }
.markdown-body li::marker { color: #71717a; }
.markdown-body blockquote {
  margin: 0.8em 0;
  padding: 0.2em 1em;
  border-left: 3px solid #d4d4d8;
  color: #52525b;
  background: #fafafa;
  border-radius: 0 4px 4px 0;
}
.markdown-body blockquote p { margin: 0.3em 0; }
.markdown-body code {
  font-family: 'Fira Code', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.875em;
  background: #f4f4f5;
  color: #be185d;
  padding: 0.15em 0.4em;
  border-radius: 4px;
}
.markdown-body pre {
  margin: 0;
  background: #f6f8fa !important;
  padding: 14px 16px !important;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  overflow-x: auto;
  font-size: 13px;
}
/* 覆盖 SyntaxHighlighter 的深色内联样式，统一浅色 */
.markdown-body pre,
.markdown-body pre span,
.markdown-body code[class*='language-'] {
  color: #24292e !important;
  background: transparent !important;
}
.markdown-body table {
  border-collapse: collapse;
  margin: 0.8em 0;
  width: 100%;
  font-size: 0.92em;
}
.markdown-body th, .markdown-body td {
  border: 1px solid #d4d4d8;
  padding: 6px 12px;
  text-align: left;
}
.markdown-body th { background: #f4f4f5; font-weight: 600; color: #18181b; }
.markdown-body tr:nth-child(even) { background: #fafafa; }
.markdown-body img { max-width: 100%; border-radius: 6px; }
.markdown-body hr { border: none; border-top: 1px solid #e4e4e7; margin: 1.4em 0; }
.markdown-body input[type='checkbox'] { margin-right: 0.4em; accent-color: #0e7490; }
/* 隐藏复制按钮等交互元素 */
.markdown-body .group { display: none !important; }
`;

/**
 * 导出为 PDF。
 * 思路：打开新窗口 → 写入预览区渲染后的 HTML + 浅色打印样式 → 调用浏览器打印。
 * 用户在打印对话框里选“另存为 PDF”即可保存。
 */
export function exportPDF(note: Note): void {
  const previewEl = document.querySelector('.markdown-body');
  const body = previewEl?.innerHTML ?? '';
  const title = note.title?.trim() || '未命名笔记';

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    // 弹窗被浏览器拦截
    alert('无法打开打印窗口，请允许本页面的弹出式窗口后重试。');
    return;
  }

  const doc = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
<h1 class="doc-title">${escapeHtml(title)}</h1>
<div class="markdown-body">${body}</div>
<script>
  window.addEventListener('load', function () {
    window.focus();
    setTimeout(function () { window.print(); }, 250);
  });
</script>
</body>
</html>`;

  win.document.open();
  win.document.write(doc);
  win.document.close();
}
