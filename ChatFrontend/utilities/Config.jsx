import AsyncStorage from '@react-native-async-storage/async-storage';

import {jwtDecode} from "jwt-decode";

export const URL = "http://localhost:3333/";
export let userId; 

export let token = ""; 

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
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
    console.log("Token initialized successfully");
  } catch (error) {
    console.error("Error initializing token:", error);
  }
};

initializeToken(); 
