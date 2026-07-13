import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export interface UseResizableOptions {
  /** 初始尺寸（像素）。如果为 0/undefined 则进入 flex 模式：首次拖拽时才锁定当前实际宽度。 */
  initial?: number;
  /** 最小尺寸。 */
  min: number;
  /** 最大尺寸。 */
  max: number;
  /** 拖拽过程中回调，用于约束（如 `next` 不可超过总宽 - 对侧最小值）。 */
  clamp?: (next: number) => number;
  /**
   * 用于读取当前实际宽度的 ref。
   * 进入 flex 模式后，mousedown 时会读取该元素的 `offsetWidth` 作为初始值。
   */
  targetRef?: React.RefObject<HTMLElement>;
}

export interface UseResizableResult {
  size: number;
  /** 绑定到拖拽条的鼠标按下处理。 */
  onMouseDown: (e: React.MouseEvent) => void;
  /** 当前是否正在拖拽。 */
  isDragging: boolean;
  /**
   * 应当直接绑定到受控元素的 style。
   * - 未锁定时返回 null（flex 模式，不限制宽度）。
   * - 锁定后返回 { width: size }，约束实际宽度。
   */
  resizeStyle: CSSProperties | null;
}

/**
 * 监听全局 mousemove/mouseup 调整尺寸。
 * 拖拽期间会临时禁用选中和光标，结束时恢复。
 *
 * 支持两种模式：
 * 1. **固定模式**（initial > 0）：始终用 `style.width = size` 约束。
 * 2. **Flex 模式**（initial 为 0 或不传）：不传 width，由 flex-1 自适应；
 *    一旦用户开始拖拽，就读取 `targetRef` 的实际宽度作为起点，切换为固定模式。
 */
export function useResizable({
  initial = 0,
  min,
  max,
  clamp,
  targetRef,
}: UseResizableOptions): UseResizableResult {
  const [size, setSize] = useState(initial);
  const [isDragging, setIsDragging] = useState(false);
  // 是否已经从 flex 模式锁定为固定宽度
  const [locked, setLocked] = useState(initial > 0);
  const startX = useRef(0);
  const startSize = useRef(initial);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Flex 模式：首次拖拽时锁定当前实际宽度
      let base = size;
      if (!locked && targetRef?.current) {
        base = targetRef.current.offsetWidth;
        startSize.current = base;
        setSize(base);
        setLocked(true);
      } else {
        startSize.current = size;
      }
      startX.current = e.clientX;
      void base; // 仅用于日志；不参与计算
      setIsDragging(true);
    },
    [size, locked, targetRef],
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startX.current;
      let next = startSize.current + delta;
      if (clamp) next = clamp(next);
      if (next < min) next = min;
      if (next > max) next = max;
      setSize(next);
    };
    const onUp = () => setIsDragging(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, min, max, clamp]);

  const resizeStyle: CSSProperties | null = locked ? { width: size } : null;

  return { size, onMouseDown, isDragging, resizeStyle };
}
