import { useEffect, useState } from 'react';

/**
 * 通用防抖 Hook：value 变化后延迟 delay 毫秒才更新返回值。
 * 默认延迟 300ms。
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
