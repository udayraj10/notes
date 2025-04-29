import React, { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Note, useNotes } from "../../context/NotesContext"
import { useSQLiteContext } from "expo-sqlite"
import { NoteScreen } from "@/components/NoteScreen"

export default function PrivateNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const db = useSQLiteContext()
  const router = useRouter()
  const { createPrivateNote, updatePrivateNote } = useNotes()
  const [privateNote, setPrivateNote] = useState({ title: "", content: "" })
  const [isNewNote, setIsNewNote] = useState(id === "new")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (id === "new" || !id) return

    const fetchNote = async () => {
      const currentNote = await db.getFirstAsync<Note>(
        "SELECT * FROM private_notes WHERE id = ?",
        [id]
      )
      if (currentNote) {
        setPrivateNote({
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
    if (!privateNote.title && !privateNote.content) {
      router.back()
      return
    }
    if (isSaving) {
      return
    }

    setIsSaving(true)

    try {
      if (isNewNote) {
        const newNote = await createPrivateNote({
          title: privateNote.title,
          content: privateNote.content,
        })
        if (newNote) {
          setIsNewNote(false)
          router.replace({
            pathname: "/note/privateScreen",
            params: { id: String(newNote.id) },
          })
          router.back()
        } else {
          throw new Error("Failed to create note")
        }
      } else {
        await updatePrivateNote(id, {
          title: privateNote.title,
          content: privateNote.content,
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
    setPrivateNote((prev) => ({ ...prev, title }))
  }

  const handleContentChange = (content: string) => {
    setPrivateNote((prev) => ({ ...prev, content }))
  }

  return (
    <NoteScreen
      title="Private"
      saveNote={saveNote}
      note={privateNote}
      handleTitleChange={handleTitleChange}
      handleContentChange={handleContentChange}
    />
  )
}
