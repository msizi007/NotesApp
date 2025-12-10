import { Stack } from "expo-router";

export default function NotesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="notes" options={{ headerTitle: "Notes" }} />
      <Stack.Screen name="auth" options={{ headerTitle: "Auth" }} />
    </Stack>
  );
}
