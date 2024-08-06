import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { AppProvider, useAppContext } from "@/utilities/useAppContext";
import ToastManager, { Toast } from "toastify-react-native";
import { initializeToken, socket, token, userId } from "@/utilities/Config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [tokenInitialized, setTokenInitialized] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      await initializeToken();
      setTokenInitialized(true); 
    };

    loadToken();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", (msg) => {});
      socket.on("disconnect", (msg) => {
        Toast.error("Disconnected");
      });
      socket.emit("register", userId);
    }

    if (loaded && tokenInitialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, tokenInitialized, socket]);

  if (!loaded || !tokenInitialized) {
    return null;
  }

  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

const Layout = () => {
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
  const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);
  const { theme } = useAppContext();
  return (
    <PaperProvider
      theme={theme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
    >
      <ThemeProvider
        value={theme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <ToastManager />
        <Stack screenOptions={{ headerShown: false }}>
          {token && (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )}
          {false && (
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
};
