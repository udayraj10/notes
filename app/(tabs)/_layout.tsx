import { colors } from "@/constants/token"
import { defaultStyles } from "@/styles"
import { Stack } from "expo-router"
import { View } from "react-native"

const Layout = () => {
  return (
    <View style={defaultStyles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="private" />
      </Stack>
    </View>
  )
}

export default Layout
