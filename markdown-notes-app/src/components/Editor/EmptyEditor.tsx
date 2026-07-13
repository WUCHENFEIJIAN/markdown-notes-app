import { forwardRef } from 'react';
import type { CSSProperties } from 'react';

interface EmptyEditorProps {
  resizeStyle?: CSSProperties | null;
}

/** 空状态下的编辑区占位，支持 ref 供 useResizable 锁定宽度。 */
export const EmptyEditor = forwardRef<HTMLElement, EmptyEditorProps>(
  function EmptyEditor({ resizeStyle }, ref) {
    return (
      <section
        ref={ref}
        style={resizeStyle ?? undefined}
        className={`flex flex-col items-center justify-center bg-panel-editor border-r border-black/40 text-zinc-500 ${
          resizeStyle ? '' : 'flex-1'
        }`}
      >
        <p className="text-lg text-zinc-400">还没有选中笔记</p>
        <p className="text-sm mt-1">点击左侧「新建笔记」开始</p>
      </section>
    );
  },
);
