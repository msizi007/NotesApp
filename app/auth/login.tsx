import { getUser } from "@/utils/storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function loginUser() {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    const user = await getUser();

    if (!user) {
      setError("User not found");
      return;
    }

    if (
      user.password !== password &&
      (user.email !== username || user.username !== username)
    ) {
      setError("Invalid username or password");
      return;
    }
    alert("Welcome back!");
    router.push("/notes");
  }
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={username}
          onChangeText={(e) => setUsername(e)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        <Text>
          Don't have an account?{" "}
          <Link style={styles.link} href="/auth/register">
            Register
          </Link>{" "}
          instead
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={loginUser}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    width: "60%",
    flex: 0.5,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 20,
    marginVertical: 20,
  },
  input: {
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#aaa",
    padding: 10,
    width: "100%",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
    color: "blue",
    textDecorationColor: "blue",
  },
  error: {
    color: "red",
  },
});
