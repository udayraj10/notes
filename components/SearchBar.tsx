import { colors } from "@/constants/token"
import { defaultStyles } from "@/styles"
import { AntDesign, Feather } from "@expo/vector-icons"
import { TextInput, View, StyleSheet, Pressable } from "react-native"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.searchContainer}>
      <AntDesign
        name="search1"
        size={20}
        color="#8e8e93"
        style={styles.searchIcon}
      />
      <TextInput
        style={[defaultStyles.text, styles.searchInput]}
        placeholder="Search"
        placeholderTextColor={colors.text}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")}>
          <Feather name="x" size={20} color="#8e8e93" />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg200,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 40,
    margin: 10,
    marginBottom: 0,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
})
