import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import Logo from "../assets/image/python icon.png";
import { Colors } from "../constants/Colors";
import { useRouter } from "expo-router";
import Toast from "react-native-root-toast";

const login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const colorShceme = useColorScheme();
  console.log(colorShceme);
  const theme = Colors[colorShceme] ?? Colors.light;
  const router = useRouter();
  const handleLogin = () => {
    fetch("http://192.168.0.205:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log("Login response:", data);

        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.success) {
          const role = data.user.is_admin;

          if (role === "admin") {
            Toast.show("Welcome Admin! Redirecting...", {
              duration: 3000,
              position: Toast.positions.BOTTOM,
            });
            setTimeout(() => {
              router.push("/userlist"); // Admin screen
            }, 3000);
          } else {
            Toast.show("Welcome User! Redirecting...", {
              duration: 3000,
              position: Toast.positions.BOTTOM,
            });
            setTimeout(() => {
              router.push("/dashboard"); // Regular user screen
            }, 3000);
          }
        } else {
          Toast.show("Login Failed: " + data.message, {
            duration: 3000,
            position: Toast.positions.BOTTOM,
          });
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Failed to connect to server.");
        console.error("Login error:", err);
      });
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={Logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      ></TextInput>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    textAlign: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 5,
    width: 200,
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#28a745",
    margin: 5,
    width: 200,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
