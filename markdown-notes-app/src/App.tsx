import { useCallback, useRef } from 'react';
import { useNotes } from './hooks/useNotes';
import { useResizable } from './hooks/useResizable';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { EmptyEditor } from './components/Editor/EmptyEditor';
import { Preview } from './components/Preview';
import { ResizeHandle } from './components/ResizeHandle';
import { ExportToolbar } from './components/ExportToolbar';

const SIDEBAR_MIN = 180;
const SIDEBAR_MAX = 480;
const SIDEBAR_DEFAULT = 250;
const EDITOR_MIN = 280;
const EDITOR_MAX = 1400;
const PREVIEW_MIN = 280;

export default function App() {
  const {
    notes,
    totalCount,
    currentNote,
    currentId,
    searchKeyword,
    setSearchKeyword,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  // 侧边栏：拖拽时保证剩余空间足够编辑器与预览
  const sidebarClamp = useCallback(
    (next: number) => {
      const windowWidth = window.innerWidth;
      const minOther = EDITOR_MIN + PREVIEW_MIN;
      return Math.min(next, windowWidth - minOther);
    },
    [],
  );
  const sidebar = useResizable({
    initial: SIDEBAR_DEFAULT,
    min: SIDEBAR_MIN,
    max: SIDEBAR_MAX,
    clamp: sidebarClamp,
  });

  // 编辑器：flex 模式，首次拖拽时锁定当前实际宽度
  // 同一个 ref 在选中态指向 Editor、空状态指向 EmptyEditor
  const editorRef = useRef<HTMLElement>(null);
  const editorClamp = useCallback(
    (next: number) => {
      const windowWidth = window.innerWidth;
      return Math.min(next, windowWidth - sidebar.size - PREVIEW_MIN);
    },
    [sidebar.size],
  );
  const editor = useResizable({
    min: EDITOR_MIN,
    max: EDITOR_MAX,
    clamp: editorClamp,
    targetRef: editorRef,
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-panel-sidebar text-zinc-200">
      <Sidebar
        notes={notes}
        totalCount={totalCount}
        currentId={currentId}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onSelect={selectNote}
        onCreate={createNote}
        onDelete={deleteNote}
        width={sidebar.size}
      />
      <ResizeHandle
        onMouseDown={sidebar.onMouseDown}
        isDragging={sidebar.isDragging}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ExportToolbar note={currentNote} />
        <div className="flex-1 flex min-h-0">
          {currentNote ? (
            <Editor
              ref={editorRef}
              key={currentNote.id}
              note={currentNote}
              onUpdate={updateNote}
              resizeStyle={editor.resizeStyle}
            />
          ) : (
            <EmptyEditor
              ref={editorRef}
              resizeStyle={editor.resizeStyle}
            />
          )}
          <ResizeHandle
            onMouseDown={editor.onMouseDown}
            isDragging={editor.isDragging}
          />
          <Preview note={currentNote} />
        </div>
      </div>
    </div>
  );
}
