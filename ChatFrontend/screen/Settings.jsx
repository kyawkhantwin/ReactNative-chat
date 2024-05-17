import { View, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  Card,
  List,
  RadioButton,
  useTheme,
} from "react-native-paper";
import { useAppContext } from "../utilities/useAppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = ({navigation}) => {
  const paperTheme = useTheme();
  const { theme, toggleAppTheme } = useAppContext();

    const logout = async () => {
      await AsyncStorage.clear();
      navigation.navigate("Login")
    }

  return (
    <SafeAreaView>
      <View style={{ marginTop: 10 }}>
        <Avatar.Image
          style={styles.avatar}
          size={100}
          source={require("../assets/avatar.jpg")}
        />
        <Card style={styles.cardContainer}>
          <List.Section style={styles.listContainer}>
            <List.Subheader>User</List.Subheader>
            <List.Item
              title="Edit User "
              left={() => <List.Icon icon="account" color="green" />}
              onPress={() => navigation.navigate('Edit')}
            />

            <List.Subheader>Theme</List.Subheader>

            <List.Item
              title="Light Theme"
              left={() => (
                <List.Icon icon="white-balance-sunny" color="orange" />
              )}
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
              left={() => (
                <List.Icon icon="moon-waxing-crescent" color="purple" />
              )}
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
              left={() => (
                <List.Icon icon="logout" color={paperTheme.colors.error} />
              )}
              onPress={logout}
            />
          </List.Section>
        </Card>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  avatar: {
    alignSelf:"center"
  },
  cardContainer: {
    // marginTop: 50,
    // marginHorizontal: 10,
  },
  listContainer: {
    paddingHorizontal: 7,
  },
});
export default Settings;
