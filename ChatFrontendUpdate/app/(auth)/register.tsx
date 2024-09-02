import React, { useState } from "react";
import { View, StyleSheet, Pressable, Platform, Alert } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { URL } from "@/utilities/Config";
import { Toast } from "toastify-react-native";
import { router } from "expo-router";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const registerHandler = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      return Alert.alert("Error", "Please fill all the fields");
    }

    setLoading(true);

    try {
      await axios.post(URL + "register", formData);
      router.push('/login');
    } catch (error) {
      console.log(error);
      Toast.error(error?.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={[styles.cardContainer, Platform.OS === 'web' && { width: 600 }]}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Register
            </Text>

            {/* Form data */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.formInput}
                label="Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              <TextInput
                style={styles.formInput}
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
              <TextInput
                style={styles.formInput}
                label="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />

              <Button
                style={styles.formInput}
                icon="forward"
                mode="contained"
                onPress={registerHandler}
                loading={loading}
              >
                Register
              </Button>
            </View>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>
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
  title: {
    alignSelf: "center",
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 30,
  },
  formInput: {
    marginVertical: 10,
  },
  loginText: {
    color: "#92b6f0",
    textAlign: "center",
    width: "100%",
    marginTop: 10,
  },
});

export default Register;
