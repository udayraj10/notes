import { colors } from "@/constants/token"
import { StyleSheet } from "react-native"

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: "relative",
  },
  text: {
    fontFamily: "Inter-Regular",
    color: colors.text,
  },
  boldText: {
    fontFamily: "Inter-Bold",
    color: colors.text,
  },
})
