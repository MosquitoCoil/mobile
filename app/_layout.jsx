import { Stack } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

const RootLayout = () => {
  const colorShceme = useColorScheme();
  console.log(colorShceme);
  const theme = Colors[colorShceme] ?? Colors.light;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="registration" options={{ title: "Registration" }} />
      <Stack.Screen
        name="login"
        options={{ title: "Login", headerShown: true }}
      />
      <Stack.Screen
        name="userlist"
        options={{ title: "List of Registered Users", headerShown: false }}
      />
      <Stack.Screen
        name="dashboard"
        options={{ title: "User Dashboard", headerShown: false }}
      />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
