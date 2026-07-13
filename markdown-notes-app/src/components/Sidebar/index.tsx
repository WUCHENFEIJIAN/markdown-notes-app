import type { Note } from '../../types/note';
import { SearchBar } from './SearchBar';
import { NoteList } from './NoteList';

interface SidebarProps {
  notes: Note[];
  totalCount: number;
  currentId: string | null;
  searchKeyword: string;
  onSearchChange: (kw: string) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  width: number;
}

export function Sidebar({
  notes,
  totalCount,
  currentId,
  searchKeyword,
  onSearchChange,
  onSelect,
  onCreate,
  onDelete,
  width,
}: SidebarProps) {
  return (
    <aside
      style={{ width }}
      className="flex-shrink-0 flex flex-col bg-panel-sidebar border-r border-black/40"
    >
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-[15px] font-bold tracking-[0.18em] select-none bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          MARKDOWN NOTES
        </h1>
      </div>
      <div className="px-2 pt-1 pb-1">
        <button
          type="button"
          onClick={onCreate}
          className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[13px] font-medium text-cyan-400 hover:text-cyan-300 rounded transition"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新建笔记
        </button>
      </div>
      <div className="px-2 pb-1">
        <SearchBar value={searchKeyword} onChange={onSearchChange} />
      </div>
      <NoteList
        notes={notes}
        totalCount={totalCount}
        currentId={currentId}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </aside>
  );
}
