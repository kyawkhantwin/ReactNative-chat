import { Stack } from "expo-router";

const authLayout = () => {
  return (
    <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default authLayout;
