interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging?: boolean;
}

/** 4px 宽拖拽命中区，整列 hover/拖拽时高亮成青色。 */
export function ResizeHandle({ onMouseDown, isDragging }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="group relative w-1 shrink-0 cursor-col-resize"
    >
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px transition-colors ${
          isDragging
            ? 'bg-cyan-400'
            : 'bg-transparent group-hover:bg-cyan-400/60'
        }`}
      />
    </div>
  );
}
