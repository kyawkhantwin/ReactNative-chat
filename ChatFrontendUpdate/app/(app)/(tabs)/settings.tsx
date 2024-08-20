import { View, ScrollView, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Card, List, RadioButton, useTheme } from "react-native-paper";
import { useAppContext } from "@/utilities/useAppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";
import axios from "axios";
import { token, URL, userId } from "@/utilities/Config";

const Settings = () => {
  const navigation = useNavigation();
  const paperTheme = useTheme();
  const [user, setUser] = useState();
  const { theme, toggleAppTheme } = useAppContext();
  const getUser = async function () {
    axios
      .get(URL + "user", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: { userId },
      })
      .then(({ data }) => {
        setUser(data.data.user);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    router.push("/login");
  };

  return (
    <CenteredSafeAreaView>
      <View style={{ marginTop: 50 ,flex:1, justifyContent:"center",alignItems:'center' }}>
        <Avatar.Image
          style={styles.avatar}
          size={100}
          source={
            user?.avatar
              ? { uri: user?.avatar }
              : require("@/assets/avatar.jpg")
          }
        />

        <Card style={[styles.cardContainer ,Platform.OS === 'web' && {width:800}]}>
          <List.Section style={styles.listContainer}>
            <List.Subheader>User</List.Subheader>
            <List.Item
              title="Edit User "
              left={() => <List.Icon icon="account" color="green" />}
              onPress={() => navigation.navigate("userEdit")}
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
    </CenteredSafeAreaView>
  );
};
const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
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
