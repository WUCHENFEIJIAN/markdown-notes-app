import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { handleTab, handleListEnter, handleFormat } from '../../utils/editor';
import type { EditorChange } from '../../utils/editor';

interface ContentAreaProps {
  value: string;
  onChange: (v: string) => void;
}

interface HistoryEntry {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export function ContentArea({ value, onChange }: ContentAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // 自定义撤销/重做栈（不依赖浏览器 execCommand）
  const undoStack = useRef<HistoryEntry[]>([]);
  const redoStack = useRef<HistoryEntry[]>([]);

  const setSelection = (start: number, end: number) => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.selectionStart = start;
      el.selectionEnd = end;
    });
  };

  const applyChange = (change: EditorChange) => {
    const el = ref.current;
    if (!el) return;

    // 压入撤销栈（记录变更前的状态）
    undoStack.current.push({
      text: value,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
    });
    redoStack.current = [];

    // 直接更新状态 → 防抖 → 预览实时刷新
    onChange(change.text);
    setSelection(change.selectionStart, change.selectionEnd);
  };

  const undo = () => {
    const el = ref.current;
    if (!el || undoStack.current.length === 0) return;
    const prev = undoStack.current.pop()!;
    redoStack.current.push({
      text: value,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
    });
    onChange(prev.text);
    setSelection(prev.selectionStart, prev.selectionEnd);
  };

  const redo = () => {
    const el = ref.current;
    if (!el || redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    undoStack.current.push({
      text: value,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
    });
    onChange(next.text);
    setSelection(next.selectionStart, next.selectionEnd);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const mod = e.metaKey || e.ctrlKey;

    // Tab / Shift+Tab — 缩进与层级控制
    if (e.key === 'Tab') {
      e.preventDefault();
      applyChange(handleTab(value, start, end, e.shiftKey));
      return;
    }

    // Enter — 列表自动续行
    if (e.key === 'Enter' && !mod) {
      const change = handleListEnter(value, start);
      if (change) {
        e.preventDefault();
        applyChange(change);
      }
      return;
    }

    // Ctrl/Cmd+B — 加粗
    if (mod && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      applyChange(handleFormat(value, start, end, 'bold'));
      return;
    }

    // Ctrl/Cmd+I — 斜体
    if (mod && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      applyChange(handleFormat(value, start, end, 'italic'));
      return;
    }

    // Ctrl/Cmd+K — 超链接
    if (mod && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      applyChange(handleFormat(value, start, end, 'link'));
      return;
    }

    // Ctrl/Cmd+Z — 撤销（优先用自定义栈，栈空时放行给浏览器）
    if (mod && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
      if (undoStack.current.length > 0) {
        e.preventDefault();
        undo();
      }
      return;
    }

    // Ctrl/Cmd+Y 或 Shift+Ctrl/Cmd+Z — 重做
    if (mod && ((e.key === 'y' || e.key === 'Y') || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) {
      if (redoStack.current.length > 0) {
        e.preventDefault();
        redo();
      }
      return;
    }

    // 复制/粘贴/剪切/全选 — 浏览器原生，不拦截
  };

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="在此输入 Markdown 内容..."
      spellCheck={false}
      rows={1}
      className="w-full resize-none px-8 py-6 font-mono text-[14.5px] text-zinc-200 placeholder-zinc-700 bg-transparent focus:outline-none"
      style={{ flex: 1, lineHeight: '1.9' }}
    />
  );
}
