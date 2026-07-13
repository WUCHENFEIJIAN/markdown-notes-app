import type { Note } from '../types/note';

const STORAGE_KEY = 'markdown_notes_data';

/** 从 LocalStorage 读取全部笔记，失败时返回空数组。 */
export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Note[];
  } catch {
    return [];
  }
}

/** 将全部笔记写入 LocalStorage。 */
export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // 容量超限或隐私模式下静默失败
  }
}
