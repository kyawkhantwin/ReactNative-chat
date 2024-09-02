import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, Platform } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import UserCard from '@/components/UserCard';
import CenteredSafeAreaView from '@/components/CenteredSafeAreaView';
import axios from 'axios';
import { URL, userId, token, socket } from '@/utilities/Config';
import { useAppContext } from '@/utilities/useAppContext';
import { Toast } from 'toastify-react-native';
import { useAuth } from '@/utilities/AuthContext';

const Home = () => {
  const { userLists, updateUserLists } = useAppContext();
  const [loading, setLoading] = useState(true);
  const { tokenInitialized } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!tokenInitialized) return;
    
    try {
      const { data } = await axios.get(URL, {
        params: { userId },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      updateUserLists(data.data.user);
    } catch (error) {
      console.log(error);
      Toast.error(error?.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [tokenInitialized, userId, token, updateUserLists]);

  const handleAddFriend = useCallback((data) => {
    updateUserLists((prevUsers) => 
      prevUsers.filter((user) => user._id !== data._id)
    );
  }, [updateUserLists]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (socket) {
      socket.on('addFriend', handleAddFriend);

      return () => {
        socket.off('addFriend', handleAddFriend);
      };
    }
  }, [socket, handleAddFriend]);

  if (loading) {
    return (
      <CenteredSafeAreaView style={styles.centered}>
        <ActivityIndicator animating={true} size="large" color="#0000ff" />
      </CenteredSafeAreaView>
    );
  }

  const renderUserCard = ({ item }) => {
    return (
      <UserCard user={item} title="Add" />
    );
  };
  return (
    <CenteredSafeAreaView>
      <Text style={styles.header}>Add Friend</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={userLists}
        renderItem={renderUserCard}
        keyExtractor={(user) => user.id}
        contentContainerStyle={Platform.OS === "web" && styles.webListContainer}
      />
    </CenteredSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
  },
  webListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%'
  },
});

export default Home;
