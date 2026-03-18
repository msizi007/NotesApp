import NoteCard from "@/components/NoteCard";
import { Category, Note } from "@/types/Note";
import { User } from "@/types/User";
import { getLocalUser, getNotes, storeNotes } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState<Category>("Work");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [updating, setUpdating] = useState(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAscending, setSortAscending] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useRouter();

  async function getUser() {
    try {
      const storedUser = await getLocalUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to load user", error);
    }
  }

  useEffect(() => {
    getUser();
    const loadNotes = async () => {
      const savedNotes = await getNotes();
      setNotes(savedNotes || []);
    };
    loadNotes();
  }, []);

  useEffect(() => {
    storeNotes(notes);
  }, [notes]);

  // Use useMemo for filtering and sorting to keep logic clean and performant
  const displayedNotes = useMemo(() => {
    let result = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortAscending !== null) {
      result.sort((a, b) =>
        sortAscending
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title),
      );
    }
    return result;
  }, [notes, searchTerm, sortAscending]);

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setUpdating(true);
      setEditNoteId(note.id);
      setTitle(note.title);
      setText(note.text);
      setCategory(note.category);
    } else {
      setUpdating(false);
      setEditNoteId(null);
      setTitle("");
      setText("");
      setCategory("Work");
    }
    setModalVisible(true);
  };

  const saveNote = () => {
    if (!title.trim() || !text.trim()) return;

    if (updating && editNoteId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editNoteId ? { ...n, title, text, category } : n,
        ),
      );
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        text,
        category,
        dateAdded: new Date(),
      };
      setNotes((prev) => [...prev, newNote]);
    }
    setModalVisible(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Add this Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <Link href="/notes/settings" style={styles.profileButton}>
          <View style={styles.smallAvatarPlaceholder}>
            <Text style={styles.smallAvatarInitial}>
              {user && user.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </Link>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            sortAscending !== null && sortAscending && styles.activeFilter,
          ]}
          onPress={() =>
            setSortAscending((prev) => (prev === null ? true : !prev))
          }
        >
          <Ionicons
            name="filter"
            size={22}
            color={sortAscending !== null && sortAscending ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onDelete={() => deleteNote(item.id)}
            onEdit={() => handleOpenModal(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.noNotes}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.noNotesTitle}>No Notes Found</Text>
            <Text style={styles.subtitle}>
              Try a different search or add a new note
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => handleOpenModal()}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalBackground}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {updating ? "Edit Note" : "New Note"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#ff4444" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Note Title"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={(v) => setCategory(v)}
                style={styles.picker}
              >
                <Picker.Item label="📁 Work" value="Work" />
                <Picker.Item label="👤 Personal" value="Personal" />
              </Picker>
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your note here..."
              value={text}
              multiline
              textAlignVertical="top"
              onChangeText={setText}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
              <Text style={styles.saveButtonText}>
                {updating ? "Save Changes" : "Add Note"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  filterButton: {
    width: 45,
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  activeFilter: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#000",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  noNotes: {
    marginTop: 100,
    alignItems: "center",
  },
  noNotesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%", // Increased from 60%
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 150,
  },
  pickerWrapper: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileButton: {
    padding: 5, // Increases touch area
  },
  // Styles for the small header icon
  smallAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half of width/height for a perfect circle
    backgroundColor: "#e1e4e8",
    justifyContent: "center",
    alignItems: "center",
  },
  smallAvatarInitial: {
    fontSize: 18, // Scaled down from 60
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif", // Cross-platform safety
  },
});
