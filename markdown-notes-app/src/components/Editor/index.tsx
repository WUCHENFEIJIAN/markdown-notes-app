import { forwardRef, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Note } from '../../types/note';
import { TitleInput } from './TitleInput';
import { ContentArea } from './ContentArea';
import { useDebounce } from '../../hooks/useDebounce';

interface EditorProps {
  note: Note;
  onUpdate: (id: string, patch: { title?: string; content?: string }) => void;
  /**
   * 来自 useResizable 的受控宽度。
   * - null/false：flex 模式（flex-1 自适应）
   * - { width }：固定宽度
   */
  resizeStyle?: CSSProperties | null;
}

export const Editor = forwardRef<HTMLElement, EditorProps>(function Editor(
  { note, onUpdate, resizeStyle },
  ref,
) {
  // 通过 App 层的 key={note.id} 保证切换笔记时整体重挂载，
  // 因此这里用 note 初始化本地状态即可。
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const debouncedTitle = useDebounce(title, 300);

  useEffect(() => {
    if (debouncedTitle !== note.title) {
      onUpdate(note.id, { title: debouncedTitle });
    }
    // 仅依赖防抖后的标题
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle]);

  // 内容实时同步到全局状态，让预览区立即响应
  useEffect(() => {
    if (content !== note.content) {
      onUpdate(note.id, { content });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <section
      ref={ref}
      style={resizeStyle ?? undefined}
      className={`flex flex-col bg-panel-editor min-w-0 min-h-0 border-r border-black/40 ${
        resizeStyle ? '' : 'flex-1'
      }`}
    >
      <header className="px-8 pt-8 pb-2">
        <TitleInput value={title} onChange={setTitle} />
      </header>
      <ContentArea value={content} onChange={setContent} />
    </section>
  );
});
