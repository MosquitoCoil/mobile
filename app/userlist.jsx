import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://192.168.0.205:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        Alert.alert("Error", "Cannot fetch user list.");
        setLoading(false);
      });
  };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("user"); // Or whatever key you use
            Toast.show("Logged out successfully.", {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
            });
            router.replace("/login");
          } catch (err) {
            console.error("Error clearing storage:", err);
            Alert.alert("Error", "Something went wrong during logout.");
          }
        },
      },
    ]);
  };

  const handleDelete = (userId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            fetch(`http://192.168.0.205:5000/api/delete-user/${userId}`, {
              method: "DELETE",
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  Alert.alert("Success", "User deleted.");
                  // Remove the deleted user from local state
                  setUsers((prev) => prev.filter((u) => u.id !== userId));
                  setEditModalVisible(false);
                } else {
                  Alert.alert("Failed", data.message);
                }
              })
              .catch((err) => {
                console.error(err);
                Alert.alert("Error", "Server error during delete.");
              });
          },
        },
      ]
    );
  };
  const handleEditPress = (user) => {
    setSelectedUser({ ...user });
    setEditModalVisible(true); // correct modal state
  };
  const updatedUser = { ...selectedUser };

  if (!updatedUser.password || updatedUser.password.trim() === "") {
    delete updatedUser.password; // prevent overwriting existing password
  }

  const handleSaveEdit = () => {
    fetch(`http://192.168.0.205:5000/api/edit-user/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Updated", data.message);

          // Update only the edited user in the list
          setUsers((prev) =>
            prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
          );

          setEditModalVisible(false);
        } else {
          Alert.alert("Error", data.message);
        }
      })
      .catch(() => Alert.alert("Error", "Failed to update user"));
  };
  const filteredUsers = users.filter(
    (u) =>
      u.firstname.toLowerCase().includes(search.toLowerCase()) ||
      u.lastname.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <ActivityIndicator size="large" color="#007BFF" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>List of Registered Users</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search users..."
        style={{
          backgroundColor: "#f0f0f0",
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
          borderWidth: 1,
        }}
      />
      <FlatList
        data={(users, filteredUsers)}
        onRefresh={fetchUsers}
        refreshing={loading}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.userCard}>
            <Text>
              {index + 1}. {item.firstname} {item.lastname}
            </Text>
            <Text>{item.username}</Text>
            <Text>User Type: {item.is_admin}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress(item)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit User</Text>

            <TextInput
              value={selectedUser?.firstname}
              onChangeText={(text) =>
                setSelectedUser({ ...selectedUser, firstname: text })
              }
              style={styles.input}
              placeholder="First Name"
            />
            <TextInput
              value={selectedUser?.lastname}
              onChangeText={(text) =>
                setSelectedUser({ ...selectedUser, lastname: text })
              }
              style={styles.input}
              placeholder="Last Name"
            />
            <TextInput
              value={selectedUser?.username}
              onChangeText={(text) =>
                setSelectedUser({ ...selectedUser, username: text })
              }
              style={styles.input}
              placeholder="Username"
            />
            <TextInput
              secureTextEntry
              onChangeText={(text) =>
                setSelectedUser({ ...selectedUser, password: text })
              }
              style={styles.input}
              placeholder="New Password"
            />
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Change user to:
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedUser?.is_admin}
                onValueChange={(value) =>
                  setSelectedUser({ ...selectedUser, is_admin: value })
                }
                mode="dropdown"
                style={styles.picker}
              >
                <Picker.Item label="admin" value="admin" />
                <Picker.Item label="user" value="user" />
              </Picker>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit} // <- use your defined function
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, marginTop: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userCard: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 12,
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 5,
    backgroundColor: "#fff", // Optional: helps on Android
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
