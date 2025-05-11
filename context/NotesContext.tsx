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
  modifiedDate: string
  isPrivate: boolean
}

interface NotesContextType {
  notes: Note[]
  createNote: (initialNote?: Partial<Note>) => Promise<Note | undefined>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

const NotesContext = createContext<NotesContextType | null>(null)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext()
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    initDB().then(() => {
      fetchNotes()
    })
  }, [db])

  const initDB = async () => {
    try {
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT,
          modifiedDate TEXT,
          isPrivate INTEGER DEFAULT 0
        )`
      )
      await db.runAsync(
        `CREATE INDEX IF NOT EXISTS idx_modifiedDate ON notes (modifiedDate)`
      )
    } catch (error) {
      console.error("Failed to initialize database:", error)
      throw new Error("Database initialization failed")
    }
  }

  // Fetch all notes, ordered by modifiedDate
  const fetchNotes = useCallback(async () => {
    try {
      const notes = await db.getAllAsync<Note>(
        "SELECT * FROM notes ORDER BY modifiedDate DESC"
      )

      // Ensure id is string and isPrivate is boolean
      const formattedNotes = notes.map((note) => ({
        ...note,
        id: note.id.toString(),
        isPrivate: !!note.isPrivate, // Convert INTEGER (0/1) to boolean
      }))
      setNotes(formattedNotes)
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      throw new Error("Unable to fetch notes")
    }
  }, [db])

  // CREATING A NOTE
  const createNote = async (initialNote: Partial<Note> = {}) => {
    const newNote = {
      title: initialNote.title || "",
      content: initialNote.content || "",
      modifiedDate: new Date().toISOString(),
      isPrivate: initialNote.isPrivate ?? false, // Default to false
    }

    try {
      const result = await db.runAsync(
        "INSERT INTO notes (title, content, modifiedDate, isPrivate) VALUES (?, ?, ?, ?)",
        newNote.title,
        newNote.content,
        newNote.modifiedDate,
        newNote.isPrivate ? 1 : 0 // Convert boolean to INTEGER
      )
      const createdNote = { ...newNote, id: result.lastInsertRowId.toString() }
      setNotes((prev) => [createdNote, ...prev])
      return createdNote
    } catch (error) {
      console.error("Failed to create note:", error)
      throw new Error("Unable to create note")
    }
  }

  // UPDATING A NOTE
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
        isPrivate: updates.isPrivate ?? !!existingNote.isPrivate,
      }

      await db.runAsync(
        "UPDATE notes SET title = ?, content = ?, modifiedDate = ?, isPrivate = ? WHERE id = ?",
        updatedNote.title,
        updatedNote.content,
        updatedNote.modifiedDate,
        updatedNote.isPrivate ? 1 : 0,
        id
      )

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      )
    } catch (error) {
      console.error("Failed to update note:", error)
      throw error instanceof Error ? error : new Error("Unable to update note")
    }
  }

  // DELETING A NOTE
  const deleteNote = async (id: string) => {
    try {
      const result = await db.runAsync("DELETE FROM notes WHERE id = ?", id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (error) {
      console.error("Failed to delete note:", error)
      throw error instanceof Error ? error : new Error("Unable to delete note")
    }
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        createNote,
        updateNote,
        deleteNote,
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
