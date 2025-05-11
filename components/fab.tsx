import { StyleSheet, TouchableOpacity } from "react-native"
import React from "react"
import { FontAwesome6 } from "@expo/vector-icons"
import { colors } from "@/constants/token"

type FabProps = {
  onPress: () => void
}

export const Fab = ({ onPress }: FabProps) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <FontAwesome6 name="add" size={24} color="black" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
})
