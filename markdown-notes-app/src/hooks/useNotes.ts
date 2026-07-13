import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Note } from '../types/note';
import { loadNotes, saveNotes } from '../utils/storage';

export interface UseNotesResult {
  /** 经过搜索过滤 + 倒序排序后的列表（用于展示）。 */
  notes: Note[];
  /** 全部笔记总数（不受搜索影响，用于空状态判断）。 */
  totalCount: number;
  currentNote: Note | null;
  currentId: string | null;
  searchKeyword: string;
  setSearchKeyword: (kw: string) => void;
  selectNote: (id: string | null) => void;
  createNote: () => void;
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'content'>>) => void;
  deleteNote: (id: string) => void;
}

export function useNotes(): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 笔记变化即持久化到 LocalStorage
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const createNote = useCallback(() => {
    const now = Date.now();
    const note: Note = {
      id: uuidv4(),
      title: '无标题笔记',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    setCurrentId(note.id);
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<Note, 'title' | 'content'>>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
        ),
      );
    },
    [],
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setCurrentId((prev) => (prev === id ? null : prev));
  }, []);

  const currentNote = useMemo(
    () => notes.find((n) => n.id === currentId) ?? null,
    [notes, currentId],
  );

  const filteredNotes = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    const list = kw
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(kw) ||
            n.content.toLowerCase().includes(kw),
        )
      : notes;
    return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchKeyword]);

  return {
    notes: filteredNotes,
    totalCount: notes.length,
    currentNote,
    currentId,
    searchKeyword,
    setSearchKeyword,
    selectNote: setCurrentId,
    createNote,
    updateNote,
    deleteNote,
  };
}
