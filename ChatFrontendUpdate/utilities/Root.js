import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import merge from "deepmerge";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chat from "../screen/Chat";
import TabApp from "./TabApp";
import { useAppContext } from "./useAppContext";
import Login from "../screen/auth/Login";
import Register from "../screen/auth/Register";
import UserEdit from "../screen/UserEdit";
import { token } from "./Config";
import ToastManager from "toastify-react-native";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const Stack = createNativeStackNavigator();

const Root = () => {
  const { theme } = useAppContext();
  return (
    <PaperProvider
      theme={theme === "light" ? CombinedDefaultTheme : CombinedDarkTheme}
    >
      <NavigationContainer
        theme={theme === "light" ? CombinedDefaultTheme : CombinedDarkTheme}
      >
        <ToastManager />

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Tab"}
        >
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Tab" component={TabApp} />

          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />

          <Stack.Screen name="Edit" component={UserEdit} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Root;
