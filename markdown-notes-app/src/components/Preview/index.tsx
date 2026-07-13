import type { Note } from '../../types/note';
import { MarkdownPreview } from './MarkdownPreview';

interface PreviewProps {
  note: Note | null;
}

export function Preview({ note }: PreviewProps) {
  if (!note) {
    return (
      <section className="flex-1 min-w-0 flex items-center justify-center bg-panel-preview">
        <p className="text-zinc-500">请从左侧选择或新建一篇笔记</p>
      </section>
    );
  }
  return <MarkdownPreview content={note.content} />;
}
