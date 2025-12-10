import NoteCard from "@/components/NoteCard";
import { getNotes, storeNotes } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type Category = "Work" | "Personal";

export interface Note {
  id: string;
  title: string;
  text: string;
  category: Category;
  dateAdded: Date;
}

export default function index() {
  const [notes, setNotes] = useState<Note[] | []>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState<Category>("Work");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [updating, setUpdating] = useState(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      const notes = await getNotes();
      setNotes(notes);
    };
    loadNotes();
  }, []);

  useEffect(() => {
    storeNotes(notes);
  }, [notes]);

  const addNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title,
      text,
      category,
      dateAdded: new Date(),
    };
    setNotes([...notes, note]);
    setModalVisible(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    alert("Note deleted successfully!");
  };

  const onEditNote = (id: string) => {
    notes.map((note) => {
      if (note.id === id) {
        setTitle(note.title);
        setText(note.text);
        setCategory(note.category);
      }
    });
    setModalVisible(true);
    setUpdating(true);
    setEditNoteId(id);
  };

  const updateNote = () => {
    const updatedNotes = notes.map((note) => {
      // Check if the current note in the iteration is the one we want to update
      if (note.id === editNoteId) {
        // Return a *new* note object with the updated properties
        return {
          ...note,
          title: title,
          text: text,
          category: category,
        };
      }
      // For all other notes, return the original note object
      return note;
    });

    // Update the state with the new array
    setNotes(updatedNotes);
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      {notes.length > 0 ? (
        <>
          <Text style={[styles.title, styles.heading]}>Tasks</Text>
          <FlatList
            keyExtractor={(item) => item.id}
            data={notes}
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                onDelete={() => deleteNote(item.id)}
                onEdit={() => onEditNote(item.id)}
              />
            )}
          />
        </>
      ) : (
        <View style={styles.noNotes}>
          <Text style={styles.title}>No Notes Yet!</Text>
          <Text style={styles.subtitle}>All added notes will appear here</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true} // important to allow custom sizing
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Note</Text>
            {/* Add your form or inputs here */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={(e) => setTitle(e)}
            />
            <Picker
              selectedValue={category}
              onValueChange={(v) => setCategory(v)}
              style={styles.dropdown}
            >
              <Picker.Item label="Work" value="Work" />
              <Picker.Item label="Personal" value="Personal" />
            </Picker>
            <TextInput
              style={[styles.input, { height: 120 }]} // increase height
              placeholder="Title"
              value={text}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top" // important for Android
              onChangeText={setText}
            />
            {updating ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  updateNote();
                }}
              >
                <Text style={styles.addButtonText}>Update Note</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={addNote}>
                <Text style={styles.addButtonText}>Add Note</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
  },
  heading: {
    marginVertical: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 500,
    color: "#aaa",
  },
  noNotes: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent background
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "60%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 500,
    padding: 10,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 5,
    marginVertical: 5,
  },
  taskActions: {
    flexDirection: "row",
  },
  taskName: {
    fontSize: 18,
    fontWeight: 500,
  },
  checkButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  completed: {
    textDecorationLine: "line-through",
  },
  dropdown: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
  },
});
