import { Note } from "@/types/Note";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NoteCard(props: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      {/* Row 1: Title (Left) | Category + Icons (Right) */}
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {props.note.title}
        </Text>

        <View style={styles.rightActions}>
          <Text
            style={[
              styles.badge,
              props.note.category === "Work" ? styles.work : styles.personal,
            ]}
          >
            {props.note.category}
          </Text>
          <TouchableOpacity onPress={props.onEdit}>
            <MaterialIcons
              name="edit"
              size={30}
              color="green"
              style={styles.iconButton}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onDelete}>
            <Ionicons
              name="trash-outline"
              size={30}
              color="red"
              style={styles.iconButton}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2: Text (Left) | Dropdown (Right) */}
      <View style={styles.row2}>
        <Text style={styles.text}>
          {expanded || props.note.text.length <= 100
            ? props.note.text
            : props.note.text.substring(0, 100) + "..."}
        </Text>

        {props.note.text.length > 100 && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.dropdown}
          >
            <Entypo
              name={expanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    flex: 1, // Takes up all available space on the left
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  row2: {
    flexDirection: "row",
    alignItems: "flex-end", // Aligns dropdown to bottom of text
    justifyContent: "space-between",
  },
  text: {
    flex: 1,
    color: "#555",
    lineHeight: 20,
  },
  dropdown: {
    marginLeft: 10,
    padding: 2,
  },
  badge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 12,
    overflow: "hidden",
    textAlign: "center",
    minWidth: 60,
  },
  work: {
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  personal: {
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  iconButton: {
    padding: 4,
  },
});
