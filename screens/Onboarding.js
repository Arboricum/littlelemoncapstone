import React, { useState, useRef, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
} from "react-native";
import PagerView from "react-native-pager-view";
import { validateEmail, validateName } from "../utils";
import Constants from "expo-constants";

import { AuthContext } from "../contexts/AuthContext";

const Onboarding = () => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [mail, setMail] = useState("");

  const isFirstValid = validateName(first);
  const isLastValid = validateName(last);
  const isMailValid = validateEmail(mail);

  const pager = useRef(PagerView);
  const { onboard } = useContext(AuthContext);

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
      <Text style={styles.welcomeText}>We'd love to know more about you</Text>
      <PagerView
        style={styles.viewPager}
        scrollEnabled={false}
        initialPage={0}
        ref={pager}
      >
        <View style={styles.page} key="1">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={first}
              onChangeText={setFirst}
              placeholder="First Name"
            />
          </View>
          <View style={styles.pageIndicator}>
            <View style={[styles.pageDot, styles.pageDotActive]} />
            <View style={styles.pageDot} />
            <View style={styles.pageDot} />
          </View>
          <Pressable
            style={[styles.btn, !isFirstValid && styles.btnDisabled]}
            onPress={() => pager.current.setPage(1)}
            disabled={!isFirstValid}
          >
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        </View>
        <View style={styles.page} key="2">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              value={last}
              onChangeText={setLast}
              placeholder="Last Name"
            />
          </View>
          <View style={styles.pageIndicator}>
            <View style={styles.pageDot} />
            <View style={[styles.pageDot, styles.pageDotActive]} />
            <View style={styles.pageDot} />
          </View>
          <View style={styles.buttons}>
            <Pressable
              style={styles.halfBtn}
              onPress={() => pager.current.setPage(0)}
            >
              <Text style={styles.btnText}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfBtn, !isLastValid && styles.btnDisabled]}
              onPress={() => pager.current.setPage(2)}
              disabled={!isLastValid}
            >
              <Text style={styles.btnText}>Next</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.page} key="3">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={mail}
              onChangeText={setMail}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.pageIndicator}>
            <View style={styles.pageDot} />
            <View style={styles.pageDot} />
            <View style={[styles.pageDot, styles.pageDotActive]} />
          </View>
          <View style={styles.buttons}>
            <Pressable
              style={styles.halfBtn}
              onPress={() => pager.current.setPage(1)}
            >
              <Text style={styles.btnText}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfBtn, !isMailValid && styles.btnDisabled]}
              onPress={() => onboard({ firstName: first, lastName: last, email: mail })}
              disabled={!isMailValid}
            >
              <Text style={styles.btnText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </PagerView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    paddingTop: Constants.statusBarHeight,
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
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 40,
    paddingVertical: 60,
    color: "#46645b",
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    color: "#46645b",
  },
  inputBox: {
    borderColor: "#e4e4e4",
    backgroundColor: "#e4e4e4",
    alignSelf: "stretch",
    height: 50,
    margin: 18,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 9,
  },
  btn: {
    backgroundColor: "#e8c914",
    borderColor: "#e8c914",
    borderRadius: 9,
    alignSelf: "stretch",
    marginHorizontal: 18,
    marginBottom: 60,
    padding: 10,
    borderWidth: 1,
  },
  btnDisabled: {
    backgroundColor: "#d9d9d9",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 18,
    marginBottom: 60,
  },
  halfBtn: {
    flex: 1,
    borderColor: "#e8c914",
    backgroundColor: "#e8c914",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 22,
    color: "#333",
    alignSelf: "center",
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  pageDot: {
    backgroundColor: "#67788a",
    width: 22,
    height: 22,
    marginHorizontal: 10,
    borderRadius: 11,
  },
  pageDotActive: {
    backgroundColor: "#e8c914",
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});

export default Onboarding;
