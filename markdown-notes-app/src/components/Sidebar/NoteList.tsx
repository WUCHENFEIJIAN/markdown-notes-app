import type { Note } from '../../types/note';
import { NoteItem } from './NoteItem';

interface NoteListProps {
  notes: Note[];
  totalCount: number;
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NoteList({
  notes,
  totalCount,
  currentId,
  onSelect,
  onDelete,
}: NoteListProps) {
  if (totalCount === 0) {
    return <Empty text="点击「新建笔记」开始记录" />;
  }
  if (notes.length === 0) {
    return <Empty text="未找到匹配的笔记" />;
  }
  return (
    <div className="flex-1 overflow-y-auto pt-1">
      {notes.map((n) => (
        <NoteItem
          key={n.id}
          note={n}
          active={n.id === currentId}
          onSelect={() => onSelect(n.id)}
          onDelete={() => onDelete(n.id)}
        />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <p className="text-sm text-zinc-500 text-center leading-relaxed">{text}</p>
    </div>
  );
}
