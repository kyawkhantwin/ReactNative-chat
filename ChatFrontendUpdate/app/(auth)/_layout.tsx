import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "expo-router";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);

    if (isReady && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isReady, router]);



  

  return (
    <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthLayout;
