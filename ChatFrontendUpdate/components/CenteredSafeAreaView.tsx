import React from "react";
import { StyleSheet,  View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediaQuery } from "react-responsive";

const CenteredSafeAreaView = ({ children }) => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 600px)" });

  // Set responsive width based on screen size
  let responsiveWidth = "100%";
  if (isLargeScreen) {
    responsiveWidth = "80%";
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { width: responsiveWidth }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    // Additional styling for content can be added here
  },
});

export default CenteredSafeAreaView;
