import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "@/constants/token"
import { defaultStyles } from "@/styles"
import { Entypo } from "@expo/vector-icons"
import { FC } from "react"

type NoteScreenProps = {
  title: string
  saveNote: () => void
  note: {
    title: string
    content: string
  }
  handleTitleChange: (text: string) => void
  handleContentChange: (text: string) => void
}

export const NoteScreenUI: FC<NoteScreenProps> = ({
  title,
  saveNote,
  note,
  handleTitleChange,
  handleContentChange,
}) => {
  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={[defaultStyles.boldText, { fontSize: 28 }]}>{title}</Text>
        <Pressable onPress={saveNote} style={{ marginRight: 10 }}>
          <Entypo name="check" size={24} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <TextInput
          style={[defaultStyles.boldText, styles.titleInput]}
          value={note.title}
          onChangeText={handleTitleChange}
          placeholder="Title"
          placeholderTextColor="#8E8E93"
          onSubmitEditing={saveNote}
          returnKeyType="done"
        />
        <TextInput
          style={[defaultStyles.text, styles.contentInput]}
          value={note.content}
          onChangeText={handleContentChange}
          placeholder="Content"
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.bg200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  titleInput: {
    height: 60,
    fontSize: 30,
    paddingHorizontal: 10,
  },
  contentInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
})
