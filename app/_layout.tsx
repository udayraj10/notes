import { useEffect } from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SQLiteProvider, SQLiteDatabase } from "expo-sqlite"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { NotesProvider } from "@/context/NotesContext"
import { colors } from "@/constants/token"

SplashScreen.preventAutoHideAsync()

const App = () => {
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <SafeAreaProvider>
      <RootNavigation />
      <StatusBar style="light" backgroundColor={colors.bg200} />
    </SafeAreaProvider>
  )
}

const RootNavigation = () => {
  return (
    <SQLiteProvider
      databaseName="notes.db"
      onInit={async (db: SQLiteDatabase) => {
        const DATABASE_VERSION = 1

        const result = await db.getFirstAsync<{ user_version: number } | null>(
          "PRAGMA user_version"
        )
        let currentVersion = result?.user_version ?? 0

        if (currentVersion >= DATABASE_VERSION) {
          return
        }

        if (currentVersion < DATABASE_VERSION) {
          // Initial migration
          await db.execAsync(`
              CREATE TABLE IF NOT EXISTS notes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT,
              content TEXT,
              modifiedDate TEXT,
              isPrivate INTEGER DEFAULT 0);
            `)
          await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
          console.log(
            "Database initialized / migrated to version",
            DATABASE_VERSION
          )
        }
      }}
    >
      <NotesProvider>
        <GestureHandlerRootView
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          <Stack
            screenOptions={{
              animation: "flip",
              gestureEnabled: true,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: true,
                title: "Notes",
                headerStyle: {
                  backgroundColor: colors.bg200,
                },
                headerTitleStyle: {
                  fontFamily: "InterBold",
                  fontSize: 30,
                  color: colors.text,
                },
              }}
            />
            <Stack.Screen name="note/[id]" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </NotesProvider>
    </SQLiteProvider>
  )
}

export default App
