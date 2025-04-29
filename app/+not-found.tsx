import { defaultStyles } from "@/styles"
import { Link, Stack } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

const NotFound = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={defaultStyles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  )
}

export default NotFound

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
