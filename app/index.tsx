import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import stickyNotesImg from "../assets/images/sticky-note.png";

export default function index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={stickyNotesImg} />
      <Text style={styles.title}>Notes App</Text>
      <Text style={styles.subtitle}>Draft your tasks, thoughts and ideas</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth/register")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 500,
    color: "#aaa",
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "50%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
