import { User } from "@/types/User";
import { getLocalUser, setLocalUser } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function Settings() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  async function getUser() {
    try {
      const storedUser = await getLocalUser();
      if (storedUser) {
        setUser(storedUser);
        // Set these directly here instead of in a separate useEffect
        setName(storedUser.username);
        setEmail(storedUser.email);
      }
    } catch (error) {
      console.error("Failed to load user", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!name.trim() || !email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedUser: User = {
      username: name,
      email: email,
      password: user!.password,
    };
    setLocalUser(updatedUser);
    alert("Profile updated successfully.");
  }

  function handleLogout() {
    router.push("/auth/login");
  }

  useEffect(() => {
    getUser();
  }, []);

  // 1. Prevent rendering if user is still null
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  // 2. Fallback if no user is found in storage
  if (!user) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>No user profile found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          {/* Use the state variable or the user object safely */}
          <Text style={styles.usernameText}>{user.username}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
            <Ionicons name="log-out-outline" size={24} color="red" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1e4e8",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#f8f9fa",
  },
  usernameText: {
    marginTop: 10,
    fontSize: 22,
    color: "#007AFF",
    fontWeight: "600",
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF3B30",
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
    paddingRight: 20,
  },
  avatarInitial: {
    fontSize: 60, // Large enough to fill the circular placeholder
    fontWeight: "bold",
    color: "#555", // A solid, clean gray (or you could use the blue from usernameText)
    textAlign: "center",
    textTransform: "uppercase", // Backup formatting to ensure capitalization
    fontFamily: "system-ui",
  },
});
