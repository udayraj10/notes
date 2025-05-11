import { defaultStyles } from "@/styles"
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useMemo } from "react"
import { useRouter } from "expo-router"
import { useNotes } from "@/context/NotesContext"
import { Note } from "@/components/Note"
import { Fab } from "@/components/fab"
import { SearchBar } from "@/components/SearchBar"
import { PasswordModal } from "@/components/PasswordModal"
import { colors } from "@/constants/token"

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("")
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const router = useRouter()
  const { notes, deleteNote, updateNote } = useNotes()

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, notes])

  const handleCreateNote = async () => {
    router.push({ pathname: "/note/[id]", params: { id: "new" } })
  }

  const openNote = (id: string) => {
    router.push({ pathname: "/note/[id]", params: { id } })
  }

  const handleNotePress = (note: any) => {
    if (note.isPrivate) {
      setSelectedNoteId(note.id)
      setPasswordModalVisible(true)
    } else {
      openNote(note.id)
    }
  }

  const renderNote = ({ item }: any) => (
    <Note
      note={item}
      onPress={() => handleNotePress(item)}
      onDelete={() => deleteNote(item.id)}
      onLongPress={() => {
        const { id, isPrivate } = item

        const nextPrivacy = !isPrivate
        const title = nextPrivacy ? "Make Private?" : "Make Public?"
        const message = nextPrivacy
          ? "Do you want to make this note private?"
          : "Do you want to make this note public?"

        Alert.alert(title, message, [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              if (item.isPrivate !== nextPrivacy) {
                updateNote(id, { isPrivate: nextPrivacy })
              }
            },
          },
        ])
      }}
    />
  )

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={defaultStyles.container}
    >
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.notesList}>
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
        />
      </View>
      <Fab onPress={handleCreateNote} />
      <PasswordModal
        visible={passwordModalVisible}
        onClose={() => {
          setPasswordModalVisible(false)
          setSelectedNoteId(null)
        }}
        onSuccess={() => {
          if (selectedNoteId) {
            openNote(selectedNoteId)
            setPasswordModalVisible(false)
            setSelectedNoteId(null)
          }
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notesList: {
    flex: 1,
    margin: 10,
  },
  listContent: {
    paddingTop: 0,
  },
})
