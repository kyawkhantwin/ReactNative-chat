import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { URL, initializeToken } from "../../utilities/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";
import { useNavigation } from "expo-router";
import { router } from "expo-router";
import { useAuth } from "@/utilities/AuthContext";

const Login = () => {
  const {setIsAuthenticated ,setTokenInitialized} = useAuth()
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    nameOrEmail: "",
    password: "",
  });

  const loginHandler = () => {
    if (!formData.nameOrEmail || !formData.password) {
      return alert("fill all the field");
    }
    axios
      .post(URL + "login", formData)
      .then(async ({ data }) => {
        const token = data.data.token;

        await AsyncStorage.setItem("token", token);
        await initializeToken();

        setIsAuthenticated(true)
        setTokenInitialized(true)
      })
      .catch((err) => {
        console.log(err);

        Toast.error(err?.responser?.data?.message || "Error Login");
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View  style={[
        styles.container, 
      
      ]}>
        <Card style={[styles.cardContainer,  Platform.OS === 'web' && { width: 600 },]}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ alignSelf: "center", fontWeight: "bold" }}
            >
              Login
            </Text>

            {/* Form data */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.formInput}
                label="Name Or Email"
                value={formData.nameOrEmail}
                onChangeText={(text) =>
                  setFormData({ ...formData, nameOrEmail: text })
                }
              />
              <TextInput
              
                style={styles.formInput}
                label="Password"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry
              />

              <Button
                style={styles.formInput}
                icon="forward"
                mode="contained"
                onPress={loginHandler}
              >
                Login
              </Button>
            </View>
            <Pressable onPress={() => navigation.navigate("register")}>
              <Text
                style={{
                  color: "#92b6f0",
                  textAlign: "center",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                New To Here? Register
              </Text>
            </Pressable>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "85%",
    paddingVertical: 10,
  },
  formContainer: {
    marginTop: 30,
  },
  formInput: {
    marginVertical: 17,
  },
});

export default Login;
