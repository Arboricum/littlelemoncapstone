import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { validateEmail } from "../utils";
import { AuthContext } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";

const Profile = () => {
  const [userForm, setUserForm] = useState({
    first: "",
    last: "",
    mail: "",
    phone: "",
    orders: false,
    password: false,
    offers: false,
    newsletter: false,
    avatar: "",
  });

  const [refresh, triggerRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("profile");
        setUserForm(JSON.parse(saved));
        triggerRefresh(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [refresh]);

  const validateName = (n) => (n.length > 0 ? n.match(/[^a-zA-Z]/) : true);

  const validatePhone = (num) =>
    !isNaN(num) && num.length === 10;

  const { update, logout } = useContext(AuthContext);

  const updateField = (key, val) => {
    setUserForm((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const isValid = () => {
    return (
      !validateName(userForm.first) &&
      !validateName(userForm.last) &&
      validateEmail(userForm.mail) &&
      validatePhone(userForm.phone)
    );
  };

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserForm((prev) => ({
        ...prev,
        avatar: result.assets[0].uri,
      }));
    }
  };

  const clearAvatar = () => {
    setUserForm((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/Logo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
      </View>
      <ScrollView style={styles.scroll}>
        <Text style={styles.heading}>Your Information</Text>
        <Text style={styles.label}>Avatar</Text>
        <View style={styles.avatarGroup}>
          {userForm.avatar ? (
            <Image source={{ uri: userForm.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {userForm.first && Array.from(userForm.first)[0]}
                {userForm.last && Array.from(userForm.last)[0]}
              </Text>
            </View>
          )}
          <View style={styles.avatarControls}>
            <Pressable style={styles.primaryBtn} onPress={pickAvatar}>
              <Text style={styles.primaryText}>Change</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={clearAvatar}>
              <Text style={styles.secondaryText}>Remove</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={userForm.first}
          onChangeText={(val) => updateField("first", val)}
          placeholder="First Name"
        />
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={userForm.last}
          onChangeText={(val) => updateField("last", val)}
          placeholder="Last Name"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userForm.mail}
          keyboardType="email-address"
          onChangeText={(val) => updateField("mail", val)}
          placeholder="Email"
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={userForm.phone}
          keyboardType="phone-pad"
          onChangeText={(val) => updateField("phone", val)}
          placeholder="Phone number"
        />
        <Text style={styles.heading}>Notifications</Text>
        <View style={styles.row}>
          <Checkbox
            style={styles.checkbox}
            value={userForm.orders}
            onValueChange={(val) => updateField("orders", val)}
            color={"#46645b"}
          />
          <Text style={styles.text}>Order statuses</Text>
        </View>
        <View style={styles.row}>
          <Checkbox
            style={styles.checkbox}
            value={userForm.password}
            onValueChange={(val) => updateField("password", val)}
            color={"#46645b"}
          />
          <Text style={styles.text}>Password changes</Text>
        </View>
        <View style={styles.row}>
          <Checkbox
            style={styles.checkbox}
            value={userForm.offers}
            onValueChange={(val) => updateField("offers", val)}
            color={"#46645b"}
          />
          <Text style={styles.text}>Special offers</Text>
        </View>
        <View style={styles.row}>
          <Checkbox
            style={styles.checkbox}
            value={userForm.newsletter}
            onValueChange={(val) => updateField("newsletter", val)}
            color={"#46645b"}
          />
          <Text style={styles.text}>Newsletter</Text>
        </View>
        <Pressable style={styles.logoutBtn} onPress={() => logout()}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryBtn} onPress={() => triggerRefresh(true)}>
            <Text style={styles.secondaryText}>Discard changes</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryBtn, !isValid() && styles.disabled]}
            onPress={() => update(userForm)}
            disabled={!isValid()}
          >
            <Text style={styles.primaryText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#d9e0e5",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  scroll: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 22,
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 9,
    borderColor: "#dcdcdc",
    backgroundColor: "#f5f5f5",
  },
  logoutBtn: {
    backgroundColor: "#e8c914",
    borderRadius: 9,
    alignSelf: "stretch",
    marginVertical: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#b89f1a",
  },
  logoutText: {
    fontSize: 22,
    color: "#333",
    alignSelf: "center",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#46645b",
    borderRadius: 9,
    alignSelf: "stretch",
    padding: 10,
    borderWidth: 1,
    borderColor: "#3b4f47",
  },
  primaryText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 9,
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#9aa8a0",
  },
  secondaryText: {
    fontSize: 18,
    color: "#3e524b",
    alignSelf: "center",
  },
  disabled: {
    backgroundColor: "#b8c4bd",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmpty: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#12805e",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  avatarControls: {
    flexDirection: "row",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
});
