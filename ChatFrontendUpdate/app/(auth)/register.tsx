import React, { useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { URL } from "@/utilities/Config";
import { Toast } from "toastify-react-native";
import { router, useNavigation } from "expo-router";

const Register = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerHandler = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return alert("Please fill all the fields");
    }
    axios
      .post(URL + "register", formData)
      .then(({ data }) => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        Toast.error(error?.responser?.data?.message || "Failed to register");
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

      <Card style={[styles.cardContainer,  Platform.OS === 'web' && { width: 600 },]}>

          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ alignSelf: "center", fontWeight: "bold" }}
            >
              Register
            </Text>

            {/* Form data */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.formInput}
                label="Name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
              <TextInput
                style={styles.formInput}
                label="Email"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
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
                onPress={registerHandler}
              >
                Register
              </Button>
            </View>
            <Pressable onPress={() => router.push("/login")}>
              <Text
                style={{
                  color: "#92b6f0",
                  textAlign: "center",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                Already Have An Account? Login
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
    marginVertical: 10,
  },
});

export default Register;
