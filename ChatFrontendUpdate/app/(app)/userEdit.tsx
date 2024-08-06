import { View, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Text, TextInput } from "react-native-paper";
import { URL, token, userId } from "@/utilities/Config";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CenteredSafeAreaView from "@/components/CenteredSafeAreaView";

const UserEdit = () => {
  const [selectedImage, setSelectedImage] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    bio: "",
    avatar: selectedImage ? selectedImage : "",
  });
  const pickImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        width: 100,
        height: 100,
        base64: true,
        quality: 0.8,
      });
      if (!result.canceled) {
        const uri = `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`;
        setSelectedImage(uri);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = {
        userId,
        name: user.name,
        email: user.email,
        oldPassword: user.oldPassword,
        newPassword: user.newPassword,
        bio: user.bio,
        avatar: user.avatar || selectedImage,
      };
      console.log(formData);

      const response = await axios.put(URL + "edit", formData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      console.log("User updated:", response.data);
      // Optionally update user state after successful update
    } catch (error) {
      console.error("Error updating user:", error.message);
      console.error("Error updating user:", error.response.data.message);
    }
  };

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
      .catch((err) => console.log(err.message));
  };

  const handleInputChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <CenteredSafeAreaView>
      <View>
        <Avatar.Image
          style={styles.avatar}
          size={100}
          source={
            user.avatar
              ? { uri: user.avatar }
              : selectedImage
              ? { uri: selectedImage }
              : require("@/assets/avatar.jpg")
          }
        />
        <Card style={styles.cardContainer}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ marginVertical: 14, alignSelf: "center" }}
            >
              Edit User
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={user.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={user.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              secureTextEntry
              value={user.oldPassword}
              onChangeText={(text) => handleInputChange("oldPassword", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={user.newPassword}
              onChangeText={(text) => handleInputChange("newPassword", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Bio"
              value={user.bio}
              onChangeText={(text) => handleInputChange("bio", text)}
            />
            <Pressable
              style={{
                backgroundColor: "#6a1b9a",
                paddingHorizontal: 10,
                paddingVertical: 20,
                borderRadius: 10,
                marginBottom: 20,
                width: "100%",
              }}
              onPress={pickImageAsync}
            >
              <Text style={{ color: "white" }}>Pick Image</Text>
            </Pressable>

            <Button
              style={{ marginVertical: 14 }}
              mode="contained"
              onPress={handleSaveChanges}
            >
              Save Change
            </Button>
          </Card.Content>
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
    marginTop: 50,
    marginHorizontal: 10,
  },
  input: {
    paddingHorizontal: 7,
    marginVertical: 7,
  },
});

export default UserEdit;
