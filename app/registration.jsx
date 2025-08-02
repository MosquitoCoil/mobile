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
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState("user");
  const router = useRouter();

  const handleRegister = () => {
    fetch("http://192.168.0.205:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        password,
        is_admin: isAdmin,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Registration Success", data.message);
          router.replace("/login"); // Go to login screen after success
        } else {
          Alert.alert("Registration Failed", data.message);
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Unable to connect to server");
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} />
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstname}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

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
    borderRadius: 5,
    padding: 10,
    width: 200,
    height: 40,
    margin: 5,
    borderWidth: 1,
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
