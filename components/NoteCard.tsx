import { Note } from "@/app/notes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NoteCard(props: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{props.note.title}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={props.onEdit}>
            <Ionicons name="create-outline" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={props.onDelete}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.text}>{props.note.text}</Text>
      <Text
        style={props.note.category === "Work" ? styles.work : styles.personal}
      >
        {props.note.category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  card: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    color: "gray",
    marginBottom: 10,
  },
  work: {
    color: "white",
    backgroundColor: "#990000",
    padding: 5,
    borderRadius: 5,
    width: "20%",
    textAlign: "center",
  },
  personal: {
    color: "white",
    backgroundColor: "#009900",
    padding: 5,
    borderRadius: 5,
    width: "20%",
  },
  button: {
    borderWidth: 2,
    padding: 5,
    borderRadius: 6,
    borderColor: "gray",
  },
});
