import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { format } from "date-fns"
import { Feather, FontAwesome5 } from "@expo/vector-icons"
import { colors } from "@/constants/token"
import { defaultStyles } from "@/styles"

interface Note {
  id: string
  title: string
  content: string
  modifiedDate: Date
}

interface Props {
  note: Note
  onPress: () => void
  onDelete: () => void
  onLongPress: () => void
}

export function Note({ note, onPress, onDelete, onLongPress }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={styles.noteContent}
        onLongPress={onLongPress}
      >
        <View style={styles.content}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[defaultStyles.boldText, styles.noteTitle]}>
              {note.title || "Untitled Note"}
            </Text>
            {(note as any).isPrivate && (
              <FontAwesome5 name="lock" size={20} color={colors.text} />
            )}
          </View>
          <Text style={styles.noteDate}>
            {format(note.modifiedDate || new Date(), "MMM d, yyyy")}
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Feather name="x" size={18} color="#8e8e93" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: colors.primary,
    borderLeftWidth: 6,
    borderRadius: 5,
    backgroundColor: colors.bg200,
    marginBottom: 12,
    position: "relative",
  },
  noteContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 28,
    marginRight: 8,
  },
  noteDate: {
    fontFamily: "Inter",
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 6,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
})
