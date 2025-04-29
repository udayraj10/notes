import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"
import { useSQLiteContext } from "expo-sqlite"

export interface Note {
  id: string
  title: string | null
  content: string | null
  modifiedDate: string // ISO string
}

interface NotesContextType {
  notes: Note[]
  privateNotes: Note[]
  createNote: (initialNote?: Partial<Note>) => Promise<Note | undefined>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  createPrivateNote: (initialNote?: Partial<Note>) => Promise<Note | undefined>
  updatePrivateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deletePrivateNote: (id: string) => Promise<void>
}

const NotesContext = createContext<NotesContextType | null>(null)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext()
  const [notes, setNotes] = useState<Note[]>([])
  const [privateNotes, setPrivateNotes] = useState<Note[]>([])

  useEffect(() => {
    initDB().then(() => {
      fetchNotes()
      fetchPrivateNotes()
    })
  }, [db])

  const initDB = async () => {
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        modifiedDate TEXT
      )`
    )
    await db.runAsync(
      `CREATE INDEX IF NOT EXISTS idx_modifiedDate ON notes (modifiedDate)`
    )

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS private_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        modifiedDate TEXT
      )`
    )
    await db.runAsync(
      `CREATE INDEX IF NOT EXISTS idx_private_modifiedDate ON private_notes (modifiedDate)`
    )
  }

  const fetchNotes = useCallback(async () => {
    const notes = await db.getAllAsync<Note>(
      "SELECT * FROM notes ORDER BY modifiedDate DESC"
    )
    setNotes(notes)
  }, [db])

  const fetchPrivateNotes = useCallback(async () => {
    const notes = await db.getAllAsync<Note>(
      "SELECT * FROM private_notes ORDER BY modifiedDate DESC"
    )
    setPrivateNotes(notes)
  }, [db])

  const createNote = async (initialNote: Partial<Note> = {}) => {
    const newNote = {
      title: initialNote.title || "",
      content: initialNote.content || "",
      modifiedDate: new Date().toISOString(),
    }

    try {
      const result = await db.runAsync(
        "INSERT INTO notes (title, content, modifiedDate) VALUES (?, ?, ?)",
        newNote.title,
        newNote.content,
        newNote.modifiedDate
      )
      const createdNote = { ...newNote, id: result.lastInsertRowId.toString() }
      setNotes((prev) => [createdNote, ...prev])
      return createdNote
    } catch (e) {
      console.error("Failed to create note:", e)
      throw e
    }
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const existingNote = await db.getFirstAsync<Note>(
        "SELECT * FROM notes WHERE id = ?",
        [id]
      )

      if (!existingNote) {
        throw new Error("Note not found")
      }

      const updatedNote = {
        id,
        title: updates.title ?? existingNote.title,
        content: updates.content ?? existingNote.content,
        modifiedDate: new Date().toISOString(),
      }

      await db.runAsync(
        "UPDATE notes SET title = ?, content = ?, modifiedDate = ? WHERE id = ?",
        updatedNote.title,
        updatedNote.content,
        updatedNote.modifiedDate,
        id
      )

      fetchNotes()
    } catch (e) {
      console.error("Failed to update note:", e)
      throw e
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await db.runAsync("DELETE FROM notes WHERE id = ?", id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (e) {
      console.error("Failed to delete note:", e)
      throw e
    }
  }

  // --- Private Notes Handlers ---

  const createPrivateNote = async (initialNote: Partial<Note> = {}) => {
    const newNote = {
      title: initialNote.title || "",
      content: initialNote.content || "",
      modifiedDate: new Date().toISOString(),
    }

    try {
      const result = await db.runAsync(
        "INSERT INTO private_notes (title, content, modifiedDate) VALUES (?, ?, ?)",
        newNote.title,
        newNote.content,
        newNote.modifiedDate
      )
      const createdNote = { ...newNote, id: result.lastInsertRowId.toString() }
      setPrivateNotes((prev) => [createdNote, ...prev])
      return createdNote
    } catch (e) {
      console.error("Failed to create private note:", e)
      throw e
    }
  }

  const updatePrivateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const existingNote = await db.getFirstAsync<Note>(
        "SELECT * FROM private_notes WHERE id = ?",
        [id]
      )

      if (!existingNote) {
        throw new Error("Private Note not found")
      }

      const updatedNote = {
        id,
        title: updates.title ?? existingNote.title,
        content: updates.content ?? existingNote.content,
        modifiedDate: new Date().toISOString(),
      }

      await db.runAsync(
        "UPDATE private_notes SET title = ?, content = ?, modifiedDate = ? WHERE id = ?",
        updatedNote.title,
        updatedNote.content,
        updatedNote.modifiedDate,
        id
      )

      fetchPrivateNotes()
    } catch (e) {
      console.error("Failed to update private note:", e)
      throw e
    }
  }

  const deletePrivateNote = async (id: string) => {
    try {
      await db.runAsync("DELETE FROM private_notes WHERE id = ?", id)
      setPrivateNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (e) {
      console.error("Failed to delete private note:", e)
      throw e
    }
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        privateNotes,
        createNote,
        updateNote,
        deleteNote,
        createPrivateNote,
        updatePrivateNote,
        deletePrivateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}
