import React from "react";
import { StyleSheet, View, ViewStyle, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediaQuery } from "react-responsive";

interface CenteredSafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CenteredSafeAreaView: React.FC<CenteredSafeAreaViewProps> = ({ children, style }) => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 600px)" });

  // Responsive width calculation
  const responsiveWidth = isLargeScreen ? "80%" : "100%";

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.content, { width: responsiveWidth }, style]}>
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
    flex: 1,
    width: "100%",
    minHeight: "96%",
  },
  
});

export default CenteredSafeAreaView;
