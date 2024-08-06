import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screen/Home";
import { Ionicons } from "@expo/vector-icons";
import Friend from "../screen/Friend";
import Message from "../screen/Message";
import Settings from "../screen/Settings";
import RequestFriend from "../screen/RequestFriend";
import { useTheme } from "react-native-paper";

const Tab = createBottomTabNavigator();

const TabApp = () => {
  const theme= useTheme()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "person-add" : "person-add-outline";
          }else if (route.name === "Request") {
            iconName = focused ? "clipboard" : "clipboard-outline";
          } else if (route.name === "Friend") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Message") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Request" component={RequestFriend} />
      <Tab.Screen name="Friend" component={Friend} />
      <Tab.Screen name="Message" component={Message} />
      <Tab.Screen name="Settings" component={Settings} />
     
    </Tab.Navigator>
  );
};

export default TabApp;
