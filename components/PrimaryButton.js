import { Pressable, Text, StyleSheet } from "react-native";

const PrimaryButton = ({ children, style, onPress }) => {
  return (
    <Pressable style={[buttonStyles.base, style]} onPress={onPress}>
      <Text style={buttonStyles.label}>{children}</Text>
    </Pressable>
  );
};

export default PrimaryButton;

const buttonStyles = StyleSheet.create({
  base: {
    backgroundColor: "#e8c914",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  label: {
    color: "#333",
    fontSize: 20,
  },
});
