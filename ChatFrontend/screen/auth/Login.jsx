import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { URL,initializeToken } from "../../utilities/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
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
        const getToken = initializeToken()
      
        if (getToken) {
          return navigation.navigate("Tab");
        }

        
      })
      .catch((err) => {
        Toast.error(err.responser.data.message)

      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={styles.cardContainer}>
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
            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={{ color:"#92b6f0",textAlign: "center", width: "100%" ,marginTop:10}}>New To Here? Register</Text>
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
