import { Pressable, StyleSheet } from "react-native"
import React from "react"
import { FontAwesome6 } from "@expo/vector-icons"
import { colors } from "@/constants/token"

type FabProps = {
  onPress: () => void
}

export const Fab = ({ onPress }: FabProps) => {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <FontAwesome6 name="add" size={24} color="black" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
})
