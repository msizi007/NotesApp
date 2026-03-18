import { Note } from "@/types/Note";
import { User } from "@/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getLocalUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem("user");
    if (!data) return null; // nothing saved
    return JSON.parse(data) as User;
  } catch (err) {
    console.error("Failed to load user:", err);
    return null;
  }
}

export function setLocalUser(user: User) {
  return AsyncStorage.setItem("user", JSON.stringify(user));
}

export function removeLocalUser() {
  return AsyncStorage.removeItem("user");
}

export async function storeNotes(notes: Note[]) {
  return AsyncStorage.setItem("notes", JSON.stringify(notes));
}

export async function getNotes(): Promise<Note[] | []> {
  try {
    const data = await AsyncStorage.getItem("notes");
    if (!data) return []; // nothing saved
    return JSON.parse(data) as Note[];
  } catch (err) {
    console.error("Failed to load notes:", err);
    return [];
  }
}
