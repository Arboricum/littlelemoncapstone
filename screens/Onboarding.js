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
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topBar}>
        <Image
          style={styles.brand}
          source={require("../assets/Logo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
      </View>
      <Text style={styles.introText}>We'd love to know more about you</Text>
      <PagerView
        style={styles.pageViewer}
        scrollEnabled={false}
        initialPage={0}
        ref={pager}
      >
        <View style={styles.pageSlide} key="1">
          <View style={styles.centerBlock}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={first}
              onChangeText={setFirst}
              placeholder="First Name"
            />
          </View>
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Pressable
            style={[styles.fullButton, !isFirstValid && styles.disabled]}
            onPress={() => pager.current.setPage(1)}
            disabled={!isFirstValid}
          >
            <Text style={styles.btnLabel}>Next</Text>
          </Pressable>
        </View>

        <View style={styles.pageSlide} key="2">
          <View style={styles.centerBlock}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={last}
              onChangeText={setLast}
              placeholder="Last Name"
            />
          </View>
          <View style={styles.paginationDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
          <View style={styles.rowButtons}>
            <Pressable
              style={styles.halfButton}
              onPress={() => pager.current.setPage(0)}
            >
              <Text style={styles.btnLabel}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfButton, !isLastValid && styles.disabled]}
              onPress={() => pager.current.setPage(2)}
              disabled={!isLastValid}
            >
              <Text style={styles.btnLabel}>Next</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.pageSlide} key="3">
          <View style={styles.centerBlock}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={mail}
              onChangeText={setMail}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.paginationDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
          <View style={styles.rowButtons}>
            <Pressable
              style={styles.halfButton}
              onPress={() => pager.current.setPage(1)}
            >
              <Text style={styles.btnLabel}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfButton, !isMailValid && styles.disabled]}
              onPress={() => onboard({ firstName: first, lastName: last, email: mail })}
              disabled={!isMailValid}
            >
              <Text style={styles.btnLabel}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </PagerView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    paddingTop: Constants.statusBarHeight,
  },
  topBar: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#d9e0e5",
  },
  brand: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  pageViewer: {
    flex: 1,
  },
  pageSlide: {
    justifyContent: "center",
  },
  centerBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  introText: {
    fontSize: 40,
    paddingVertical: 60,
    color: "#46645b",
    textAlign: "center",
  },
  label: {
    fontSize: 24,
    color: "#46645b",
  },
  input: {
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
  fullButton: {
    backgroundColor: "#e8c914",
    borderColor: "#e8c914",
    borderRadius: 9,
    alignSelf: "stretch",
    marginHorizontal: 18,
    marginBottom: 60,
    padding: 10,
    borderWidth: 1,
  },
  disabled: {
    backgroundColor: "#d9d9d9",
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 18,
    marginBottom: 60,
  },
  halfButton: {
    flex: 1,
    borderColor: "#e8c914",
    backgroundColor: "#e8c914",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
  },
  btnLabel: {
    fontSize: 22,
    color: "#333",
    alignSelf: "center",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    backgroundColor: "#67788a",
    width: 22,
    height: 22,
    marginHorizontal: 10,
    borderRadius: 11,
  },
  activeDot: {
    backgroundColor: "#e8c914",
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});

export default Onboarding;
