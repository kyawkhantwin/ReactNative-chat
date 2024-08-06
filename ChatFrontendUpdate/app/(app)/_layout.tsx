import { Stack } from "expo-router";

const appLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="chat/[friendId]" />
      <Stack.Screen name="userEdit" />
    </Stack>
  );
};

export default appLayout;
