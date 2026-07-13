import { useState } from 'react';
import type { Note } from '../../types/note';
import { formatRelative, getSummary } from '../../utils/format';

interface NoteItemProps {
  note: Note;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function NoteItem({ note, active, onSelect, onDelete }: NoteItemProps) {
  const [confirming, setConfirming] = useState(false);
  const title = note.title || '无标题笔记';

  return (
    <>
      <div
        onClick={onSelect}
        className={`group relative px-3 py-2 cursor-pointer transition-colors ${
          active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
        }`}
      >
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-cyan-400 rounded-r" />
        )}
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`text-[13px] font-medium truncate ${
              active ? 'text-cyan-300' : 'text-zinc-200'
            }`}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(true);
            }}
            className="flex-shrink-0 p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            title="删除笔记"
            aria-label="删除笔记"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-zinc-500 mt-0.5">{formatRelative(note.updatedAt)}</p>
        <p className="text-[12px] text-zinc-500 mt-0.5 line-clamp-1">{getSummary(note.content)}</p>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setConfirming(false)}
        >
          <div
            className="bg-panel-modal border border-panel-modalBorder rounded-xl p-5 w-80 max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[15px] font-medium text-zinc-100">删除笔记</h3>
            <p className="text-[13px] text-zinc-400 mt-2">
              确认删除「{title}」？此操作不可恢复。
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-3 py-1.5 text-[13px] rounded-lg bg-zinc-700/60 text-zinc-200 hover:bg-zinc-700 transition"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  setConfirming(false);
                }}
                className="px-3 py-1.5 text-[13px] rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
