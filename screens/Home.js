import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  Alert,
  Image,
  Pressable,
} from "react-native";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "../database";
import { Searchbar } from "react-native-paper";
import Filters from "../components/Filters";
import { getSectionListData, useUpdateEffect } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";

const ENDPOINT =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const categories = ["starters", "mains", "desserts"];

const DishCard = ({ title, cost, details, picture }) => (
  <View style={styles.dishContainer}>
    <View style={styles.dishTextBlock}>
      <Text style={styles.dishName}>{title}</Text>
      <Text style={styles.dishDesc}>{details}</Text>
      <Text style={styles.dishPrice}>${cost}</Text>
    </View>
    <Image
      style={styles.dishImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${picture}?raw=true`,
      }}
    />
  </View>
);

const Home = ({ navigation }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });

  const [menuData, setMenuData] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState(
    categories.map(() => false)
  );

  const retrieveData = async () => {
    try {
      const res = await fetch(ENDPOINT);
      const json = await res.json();
      const structured = json.menu.map((entry, i) => ({
        id: i + 1,
        name: entry.name,
        price: entry.price.toString(),
        description: entry.description,
        image: entry.image,
        category: entry.category,
      }));
      return structured;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      let items = [];
      try {
        await createTable();
        items = await getMenuItems();
        if (!items.length) {
          items = await retrieveData();
          saveMenuItems(items);
        }
        const organized = getSectionListData(items);
        setMenuData(organized);
        const savedProfile = await AsyncStorage.getItem("profile");
        setUserData(JSON.parse(savedProfile));
      } catch (err) {
        Alert.alert(err.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const selected = categories.filter((_, idx) => {
        if (activeFilters.every((flag) => flag === false)) return true;
        return activeFilters[idx];
      });
      try {
        const filtered = await filterByQueryAndCategories(searchTerm, selected);
        const organized = getSectionListData(filtered);
        setMenuData(organized);
      } catch (err) {
        Alert.alert(err.message);
      }
    })();
  }, [activeFilters, searchTerm]);

  const searchHandler = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const debouncedSearch = useMemo(() => debounce(searchHandler, 500), [searchHandler]);

  const handleTextChange = (text) => {
    setInputText(text);
    debouncedSearch(text);
  };

  const toggleFilter = async (i) => {
    const copy = [...activeFilters];
    copy[i] = !activeFilters[i];
    setActiveFilters(copy);
  };

  return (
    <View style={styles.pageRoot}>
      <View style={styles.pageHeader}>
        <Image
          style={styles.pageLogo}
          source={require("../assets/Logo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          {userData.image !== "" ? (
            <Image source={{ uri: userData.image }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileFallback}>
              <Text style={styles.profileText}>
                {userData.firstName && Array.from(userData.firstName)[0]}
                {userData.lastName && Array.from(userData.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.heroContainer}>
        <Text style={styles.heroMainTitle}>Little Lemon</Text>
        <View style={styles.heroContent}>
          <View style={styles.heroTextWrapper}>
            <Text style={styles.heroSubTitle}>Chicago</Text>
            <Text style={styles.heroParagraph}>
              A cozy Mediterranean place where family traditions meet modern flavors.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../assets/Hero image.png")}
            accessible={true}
            accessibilityLabel={"Little Lemon Food"}
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#444"
          onChangeText={handleTextChange}
          value={inputText}
          style={styles.heroSearchbar}
          iconColor="#444"
          inputStyle={{ color: "#444" }}
          elevation={0}
        />
      </View>

      <Text style={styles.deliveryBanner}>GET YOUR FAVORITES DELIVERED!</Text>

      <Filters
        selections={activeFilters}
        onChange={toggleFilter}
        sections={categories}
      />

      <SectionList
        style={styles.sectionWrapper}
        sections={menuData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DishCard
            title={item.name}
            cost={item.price}
            details={item.description}
            picture={item.image}
          />
        )}
        renderSectionHeader={({ section: { name } }) => (
          <Text style={styles.sectionHeader}>{name}</Text>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  pageRoot: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    paddingTop: 18,
  },
  pageHeader: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#d9e0e5",
  },
  pageLogo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  sectionWrapper: {
    paddingHorizontal: 16,
  },
  heroSearchbar: {
    marginTop: 15,
    backgroundColor: "#ededed",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  dishContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
  },
  dishTextBlock: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#46645b",
    backgroundColor: "#fff",
  },
  dishName: {
    fontSize: 20,
    color: "#111",
    paddingBottom: 5,
  },
  dishDesc: {
    color: "#46645b",
    paddingRight: 5,
  },
  dishPrice: {
    fontSize: 20,
    color: "#ed9c72",
    paddingTop: 5,
  },
  dishImage: {
    width: 100,
    height: 100,
  },
  profileButton: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#12805e",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  heroContainer: {
    backgroundColor: "#46645b",
    padding: 15,
  },
  heroMainTitle: {
    color: "#e8c914",
    fontSize: 54,
  },
  heroSubTitle: {
    color: "#fdfdfd",
    fontSize: 30,
  },
  heroParagraph: {
    color: "#fdfdfd",
    fontSize: 14,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroTextWrapper: {
    flex: 1,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  deliveryBanner: {
    fontSize: 18,
    padding: 15,
  },
});
