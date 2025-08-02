/* .jsx it contains components, template render */
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Logo from "../assets/image/python icon.png";

const Home = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={Logo} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/registration")}
      >
        <Text style={styles.buttonText}>Registration</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "eee",
    padding: 20,
    borderRadius: 5,
    boxShadow: "4px 4px rgba(0,0,0,.1)",
  },
  button: {
    backgroundColor: "#007BFF",
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
