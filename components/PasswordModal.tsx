import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native"
import * as SecureStore from "expo-secure-store"
import { colors } from "@/constants/token"
import { defaultStyles } from "@/styles"

type PasswordModalProps = {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

export const PasswordModal = ({
  visible,
  onClose,
  onSuccess,
}: PasswordModalProps) => {
  const [password, setPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [error, setError] = useState("")
  const [isPasswordSet, setIsPasswordSet] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)

  useEffect(() => {
    const checkPassword = async () => {
      const storedPassword = await SecureStore.getItemAsync(
        "privateTabPassword"
      )
      setIsPasswordSet(!!storedPassword)
    }
    if (visible) {
      checkPassword()
      resetFields()
    }
  }, [visible])

  const handleSubmit = async () => {
    const storedPassword = await SecureStore.getItemAsync("privateTabPassword")

    if (isResetMode) {
      if (currentPassword !== storedPassword) {
        setError("Current password is incorrect")
      } else if (password.length < 4) {
        setError("New password must be at least 4 characters")
      } else {
        await SecureStore.setItemAsync("privateTabPassword", password)
        resetFields()
        onSuccess()
      }
    } else if (isPasswordSet) {
      if (password === storedPassword) {
        resetFields()
        onSuccess()
      } else {
        setError("Incorrect password")
      }
    } else {
      if (password.length < 4) {
        setError("Password must be at least 4 characters")
      } else {
        await SecureStore.setItemAsync("privateTabPassword", password)
        resetFields()
        onSuccess()
      }
    }
  }

  const resetFields = () => {
    setPassword("")
    setCurrentPassword("")
    setError("")
    setIsResetMode(false)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={defaultStyles.container}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, defaultStyles.boldText]}>
            {isResetMode
              ? "Reset Password"
              : isPasswordSet
              ? "Enter Password"
              : "Create Password"}
          </Text>

          {isResetMode && (
            <TextInput
              style={[styles.passwordInput, defaultStyles.text]}
              placeholder="Current Password"
              placeholderTextColor="#8e8e93"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              inputMode="numeric"
              maxLength={4}
            />
          )}

          <TextInput
            style={[styles.passwordInput, defaultStyles.text]}
            placeholder={
              isResetMode
                ? "New Password"
                : isPasswordSet
                ? "Password"
                : "Create New Password"
            }
            placeholderTextColor="#8e8e93"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            inputMode="numeric"
            maxLength={4}
            autoFocus={true}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[defaultStyles.boldText, { fontSize: 16 }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={[defaultStyles.boldText, { fontSize: 16 }]}>
                {isResetMode ? "Update" : isPasswordSet ? "Submit" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>

          {isPasswordSet && !isResetMode && (
            <TouchableOpacity
              onPress={() => {
                setIsResetMode(true)
                setError("")
              }}
              style={styles.resetButton}
            >
              <Text style={[defaultStyles.boldText, styles.resetButtonText]}>
                Reset Password
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    margin: 20,
  },
  modalTitle: {
    fontSize: 30,
    marginBottom: 15,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#D73030",
    fontFamily: "Inter-Regular",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#C83232",
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  resetButton: {
    marginTop: 15,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
})
