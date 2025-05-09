import { colors } from "@/constants/token"
import { defaultStyles } from "@/styles"
import { View, StyleSheet, FlatList, Pressable, Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useMemo } from "react"
import { useRouter } from "expo-router"
import { useNotes } from "@/context/NotesContext"
import { Note } from "@/components/Note"
import { PasswordModal } from "@/components/PasswordModal"
import { Fab } from "@/components/fab"
import { SearchBar } from "@/components/SearchBar"

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const router = useRouter()
  const { notes, deleteNote } = useNotes()

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, notes])

  const handleCreateNote = async () => {
    router.push({
      pathname: "/note/normalScreen",
      params: { id: "new" },
    })
  }

  const handlePrivateAccessSuccess = () => {
    setModalVisible(false)
    router.push("/private")
  }

  const renderNote = ({ item }: any) => (
    <Note
      note={item}
      onPress={() =>
        router.push({
          pathname: "/note/normalScreen",
          params: { id: String(item.id) },
        })
      }
      onDelete={() => deleteNote(item.id)}
    />
  )

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={[defaultStyles.boldText, { fontSize: 28 }]}>Notes</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            { padding: 10 },
            pressed && { opacity: 0.7 },
          ]}
        >
          <MaterialCommunityIcons
            name="incognito"
            size={24}
            color={colors.text}
          />
        </Pressable>
      </View>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.notesList}>
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
        />
        <Fab onPress={handleCreateNote} />
      </View>
      <PasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handlePrivateAccessSuccess}
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
  headerContainer: {
    backgroundColor: colors.bg200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
})
