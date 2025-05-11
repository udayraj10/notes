import { colors } from "@/constants/token"
import { StyleSheet } from "react-native"

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: "relative",
  },
  text: {
    fontFamily: "Inter",
    color: colors.text,
  },
  boldText: {
    fontFamily: "InterBold",
    color: colors.text,
  },
})
