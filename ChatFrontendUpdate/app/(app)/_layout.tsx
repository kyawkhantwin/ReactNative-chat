import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "expo-router";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);

    if (isReady && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isReady, router]);

 

 

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chat/[friendId]" />
      <Stack.Screen name="userEdit" />
    </Stack>
  );
};

export default AppLayout;
