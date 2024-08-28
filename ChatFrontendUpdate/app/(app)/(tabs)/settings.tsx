import { View, StyleSheet, ScrollView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Card, List, RadioButton, useTheme } from "react-native-paper";
import { useAppContext } from "@/utilities/useAppContext";
import axios from "axios";
import { token, URL, userId } from "@/utilities/Config";
import { useAuth } from "@/utilities/AuthContext";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";
import { useNavigation } from "expo-router";

const Settings = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const paperTheme = useTheme();
  const [user, setUser] = useState();
  const { theme, toggleAppTheme } = useAppContext();

  const getUser = async function () {
    try {
      const response = await axios.get(URL + "user", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: { userId },
      });
      setUser(response.data.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <CenteredSafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Avatar.Image
          style={styles.avatar}
          size={100}
          source={
            user?.avatar
              ? { uri: user?.avatar }
              : require("@/assets/avatar.jpg")
          }
        />
        <Card style={[styles.cardContainer, Platform.OS=== "web"
        ]}>
          <List.Section>
            <List.Subheader>User</List.Subheader>
            <List.Item
              title="Edit User"
              left={() => <List.Icon icon="account" color="green" />}
              onPress={() => navigation.navigate("userEdit")}
            />

            <List.Subheader>Theme</List.Subheader>
            <List.Item
              title="Light Theme"
              left={() => <List.Icon icon="white-balance-sunny" color="orange" />}
              right={() => (
                <View>
                  <RadioButton
                    value="light"
                    status={theme === "light" ? "checked" : "unchecked"}
                    onPress={toggleAppTheme}
                  />
                </View>
              )}
              onPress={toggleAppTheme}
            />
            <List.Item
              title="Dark Theme"
              left={() => <List.Icon icon="moon-waxing-crescent" color="purple" />}
              right={() => (
                <View>
                  <RadioButton
                    value="dark"
                    status={theme === "dark" ? "checked" : "unchecked"}
                    onPress={toggleAppTheme}
                  />
                </View>
              )}
              onPress={toggleAppTheme}
            />

            <List.Subheader>Logout</List.Subheader>
            <List.Item
              titleStyle={{ color: paperTheme.colors.error }}
              title="Logout"
              left={() => <List.Icon icon="logout" color={paperTheme.colors.error} />}
              onPress={logout}
            />
          </List.Section>
        </Card>
      </ScrollView>
    </CenteredSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    marginBottom: 20,
  },
  cardContainer: {
    width: "100%",  // Ensure card takes full width on mobile
    marginTop: 20,
    padding: 16,
  },
});

export default Settings;
