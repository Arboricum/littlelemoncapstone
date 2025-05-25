import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((item, i) => {
        const isSelected = selections[i];
        const bgColor = isSelected ? "#46645b" : "#e4e4e4";
        const textColor = isSelected ? "#f5f5f5" : "#46645b";

        return (
          <TouchableOpacity
            key={i}
            onPress={() => onChange(i)}
            style={{
              flex: 1 / sections.length,
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
              backgroundColor: bgColor,
              borderRadius: 9,
              marginRight: 15,
            }}
          >
            <View>
              <Text style={{ color: textColor }}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#fcfcfc",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 15,
  },
});

export default Filters;
