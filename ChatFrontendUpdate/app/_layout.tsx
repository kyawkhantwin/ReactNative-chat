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

import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { AppProvider, useAppContext } from "@/utilities/useAppContext";
import ToastManager, { Toast } from "toastify-react-native";
import { initializeToken, socket, token as storedToken, userId } from "@/utilities/Config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [tokenInitialized, setTokenInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        await initializeToken();
        setTokenInitialized(true);
        setIsAuthenticated(!!storedToken); 
        console.log(userId)
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {});
      socket.on("disconnect", () => {
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
      <Layout isAuthenticated={isAuthenticated} />
    </AppProvider>
  );
}

const Layout = ({ isAuthenticated }) => {
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
  const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);
  const { theme } = useAppContext();

  console.log('isAuth',isAuthenticated)

  return (
    <PaperProvider
      theme={theme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
    >
      <ThemeProvider
        value={theme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <ToastManager />
        <Stack screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </>
          ) : (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
};
