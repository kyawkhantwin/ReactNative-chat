import AsyncStorage from "@react-native-async-storage/async-storage";

import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
export const URL = "http://192.168.100.64:3333/";

export let userId;
export const socket = io(URL);
export let token = "";

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const initializeToken = async () => {
  try {
    token = await getToken();
    const decodedToken = jwtDecode(token);
    userId = decodedToken._id;
  } catch (error) {
    console.error("Error initializing token:", error);
  }
};

initializeToken();
