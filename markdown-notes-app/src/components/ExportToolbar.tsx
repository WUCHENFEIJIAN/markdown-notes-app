import type { Note } from '../types/note';
import { exportMarkdown, exportPDF } from '../utils/exporter';

interface ExportToolbarProps {
  note: Note | null;
}

/** MD 文件图标 */
function MdIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13l1.5 2 1.5-2v4" />
      <path d="M15 13v4" />
    </svg>
  );
}

/** PDF 图标 */
function PdfIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 15h1.5a1 1 0 0 1 0 2H8v-2" />
      <path d="M12 15v2h1.5" />
      <path d="M16 15h1.5a1 1 0 0 1 0 2H16v-2" />
    </svg>
  );
}

export function ExportToolbar({ note }: ExportToolbarProps) {
  const hasNote = !!note;

  return (
    <header className="flex items-center justify-between gap-4 px-8 h-12 shrink-0 border-b border-black/40 bg-panel-editor">
      <div className="flex items-center gap-2 min-w-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        <span className={`text-sm truncate ${hasNote ? 'text-zinc-300' : 'text-zinc-600'}`}>
          {hasNote ? note.title || '无标题笔记' : '未选择笔记'}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          disabled={!hasNote}
          onClick={() => hasNote && exportMarkdown(note!)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-white/10 text-zinc-300 hover:border-cyan-400/30 hover:text-cyan-300 hover:bg-white/[0.04] transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-zinc-300 disabled:hover:bg-transparent"
        >
          <MdIcon />
          导出 MD
        </button>
        <button
          type="button"
          disabled={!hasNote}
          onClick={() => hasNote && exportPDF(note!)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-cyan-400 text-zinc-900 hover:bg-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cyan-400"
        >
          <PdfIcon />
          导出 PDF
        </button>
      </div>
    </header>
  );
}
