import { User } from "@/types/User";
import { getLocalUser, setLocalUser } from "@/utils/storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const registerUser = () => {
    setError(""); // Reset error state
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const payload: User = {
      username,
      email,
      password,
    };

    setLocalUser(payload);
    router.push("/notes");
  };

  console.log("333", getLocalUser());

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us to start journaling your thoughts
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Pick a unique username"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={registerUser}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link style={styles.link} href="/auth/login">
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 30,
  },
  headerSection: {
    marginBottom: 40,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  button: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    color: "#FF3B30",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#666",
    fontSize: 15,
  },
  link: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
