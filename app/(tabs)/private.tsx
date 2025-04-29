import { colors } from "@/constants/token"
import { defaultStyles } from "@/styles"
import { View, StyleSheet, FlatList, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useMemo } from "react"
import { useRouter } from "expo-router"
import { useNotes } from "@/context/NotesContext"
import { Note } from "@/components/Note"
import { Fab } from "@/components/fab"
import { SearchBar } from "@/components/SearchBar"

const Private = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { privateNotes, deletePrivateNote } = useNotes()

  const filteredNotes = useMemo(() => {
    return privateNotes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, privateNotes])

  const handleCreateNote = async () => {
    router.push({
      pathname: "/note/privateScreen",
      params: { id: "new" },
    })
  }

  const renderNote = ({ item }: any) => (
    <Note
      note={item}
      onPress={() =>
        router.push({
          pathname: "/note/privateScreen",
          params: { id: String(item.id) },
        })
      }
      onDelete={() => deletePrivateNote(item.id)}
    />
  )

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={[defaultStyles.boldText, { fontSize: 28 }]}>Private</Text>
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
    </SafeAreaView>
  )
}

export default Private

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.bg200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  notesList: {
    flex: 1,
    margin: 10,
  },
  listContent: {
    paddingTop: 0,
  },
})
