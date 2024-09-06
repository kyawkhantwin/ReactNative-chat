// RootLayout.js
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useCallback } from "react";
import "react-native-reanimated";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { AppProvider, useAppContext } from "@/utilities/useAppContext";
import ToastManager, { Toast } from "toastify-react-native";
import { AuthProvider, useAuth } from "@/utilities/AuthContext";
import { socket, token } from "@/utilities/Config";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Handle socket events with cleanup
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {};
      const handleDisconnect = () => {
        Toast.error("Disconnected");
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </AppProvider>
  );
}

const Layout = () => {
  const { isAuthenticated, tokenInitialized } = useAuth();
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
  const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);
  const { theme } = useAppContext();

  if (!tokenInitialized) {
    return null;
  }

  return (
    <PaperProvider
      theme={theme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
    >
      <ThemeProvider
        value={theme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <ToastManager />
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName={isAuthenticated ? "(app)" : "(auth)"}
        >
          {isAuthenticated ? (
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
};
