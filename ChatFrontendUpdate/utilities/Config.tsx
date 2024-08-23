import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { io } from "socket.io-client";

export const URL = "http://localhost:3333/";

export let userId;
export const socket = io(URL);
export let token = "";

const getToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("token");
    if (!storedToken) {
      throw new Error("Token not found in AsyncStorage");
    }
    return storedToken;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const initializeToken = async () => {
  try {
    token = await getToken();
    if (!token || typeof token !== 'string') {
      throw new Error("Invalid token format: must be a non-empty string");
    }
    const decodedToken =  jwtDecode(token);
    userId = decodedToken._id;
    console.log(decodedToken)
  } catch (error) {
    console.error("Error initializing token:", error);
  }
};

initializeToken();
