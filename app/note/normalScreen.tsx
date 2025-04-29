import React, { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Note, useNotes } from "../../context/NotesContext"
import { useSQLiteContext } from "expo-sqlite"
import { NoteScreen } from "@/components/NoteScreen"

export default function NormalNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const db = useSQLiteContext()
  const router = useRouter()
  const { createNote, updateNote } = useNotes()
  const [note, setNote] = useState({ title: "", content: "" })
  const [isNewNote, setIsNewNote] = useState(id === "new")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (id === "new" || !id) return

    const fetchNote = async () => {
      const currentNote = await db.getFirstAsync<Note>(
        "SELECT * FROM notes WHERE id = ?",
        [id]
      )
      if (currentNote) {
        setNote({
          title: currentNote.title || "",
          content: currentNote.content || "",
        })
      } else {
        console.log("Note not found for id:", id)
      }
    }
    fetchNote()
  }, [id, db])

  const saveNote = async () => {
    if (!note.title && !note.content) {
      router.back()
      return
    }
    if (isSaving) {
      return
    }

    setIsSaving(true)

    try {
      if (isNewNote) {
        const newNote = await createNote({
          title: note.title,
          content: note.content,
        })
        if (newNote) {
          setIsNewNote(false)
          router.replace({
            pathname: "/note/normalScreen",
            params: { id: String(newNote.id) },
          })
          router.back()
        } else {
          throw new Error("Failed to create note")
        }
      } else {
        await updateNote(id, {
          title: note.title,
          content: note.content,
        })
        router.back()
      }
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTitleChange = (title: string) => {
    setNote((prev) => ({ ...prev, title }))
  }

  const handleContentChange = (content: string) => {
    setNote((prev) => ({ ...prev, content }))
  }

  return (
    <NoteScreen
      title="Notes"
      saveNote={saveNote}
      note={note}
      handleTitleChange={handleTitleChange}
      handleContentChange={handleContentChange}
    />
  )
}
