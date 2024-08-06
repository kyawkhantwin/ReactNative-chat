import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [friends, setFriends] = useState([]);
  const updateFriends = (friend) => {
    setFriends(friend);
  };

  const [userLists, setUserLists] = useState([]);
  const [userSentFriendRequest, setUserSentFriendRequest] = useState([]);

  const updateUserLists = (updateUser) => {
    setUserLists(updateUser);
  };

  const updateUserSentFriendRequest = (updateUser) => {
    setUserSentFriendRequest(updateUser);
  };

  const toggleAppTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        userLists,
        userSentFriendRequest,
        friends,

        updateFriends,
        updateUserLists,
        toggleAppTheme,
        updateUserSentFriendRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
