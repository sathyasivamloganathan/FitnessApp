import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { EvilIcons } from "@expo/vector-icons";

import { getNextDate, getPreviousDate } from "../../../utils/utils";

const MyFood = () => {
  const [storedItem, setStoredItem] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [totalProtien, setTotalProtien] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [itemsAddedToday, setItemsAddedToday] = useState([]);

  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  console.log(currentDate);

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("myFood");
      console.log("Stored Data: ", storedData);
      if (storedData) {
        try {
          const parsedData = storedData ? JSON.parse(storedData) : [];
          setStoredItem(parsedData);
          calculateCalories(itemsAddedToday);
          filterByTodaydate(parsedData);
        } catch (error) {
          console.log("Error at parsing");
        }
      }
    } catch (error) {
      console.log("Error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateCalories = (data) => {
    let calories = 0;
    let fat = 0;
    let protien = 0;
    data.forEach((item) => {
      calories += item.cal;
      fat += item.fat;
      protien += item.protien;
    });
    // const { calories, fat, protien } = calculateCalories(data);
    setTotalCalories(calories);
    setTotalFat(fat);
    setTotalProtien(protien);
  };

  const renderedProgress = (value, total, stroke, inactiveStroke, title) => {
    return (
      <CircularProgress
        value={value}
        radius={40}
        maxValue={total}
        initialValue={0}
        progressValueColor={stroke}
        activeStrokeColor={stroke}
        activeStrokeWidth={9}
        title={title}
        inActiveStrokeWidth={9}
        inActiveStrokeColor={inactiveStroke}
      />
    );
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filterByTodaydate = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const itemsToday = data.filter(
      (item) => item.timestamp && item.timestamp === today
    );
    setItemsAddedToday(itemsToday);
  };

  const filterByPrevdate = (date) => {
    const itemsforDate = storedItem.filter(
      (item) => item.timestamp && item.timestamp.split("T")[0] === date
    );
    setItemsAddedToday(itemsforDate);
  };

  // const getPreviousDate = (currentDate) => {
  //   const previousDate = new Date(currentDate);
  //   previousDate.setDate(previousDate.getDate() - 1);
  //   return previousDate.toISOString().split("T")[0];
  // }

  const handleBackArrowPress = () => {
    const previousDate = getPreviousDate(currentDate);
    setCurrentDate(previousDate);
    filterByPrevdate(previousDate);
  };

  // const getNextDate = (currentDate) => {
  //   const previousDate = new Date(currentDate);
  //   previousDate.setDate(previousDate.getDate() + 1);
  //   return previousDate.toISOString().split("T")[0];
  // };

  const handleFrontArrowPress = () => {
    const nextDate = getNextDate(currentDate);
    setCurrentDate(nextDate);
    filterByPrevdate(nextDate);
  };

  useEffect(() => {
    calculateCalories(itemsAddedToday);
  }, [itemsAddedToday]);

  console.log(itemsAddedToday);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#d5d8ed",
          marginTop: 20,
          marginBottom: 20,
          marginHorizontal: 10,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            gap: 40,
            paddingTop: 25,
            paddingBottom: 15,
            paddingRight: 25,
            paddingLeft: 25,
          }}
        >
          {renderedProgress(
            totalCalories.toFixed(2),
            2000,
            "#605dfb",
            "#c0c2de",
            "Calories"
          )}
          {renderedProgress(
            totalFat.toFixed(2),
            50,
            "#9c4ce2",
            "#c0c2de",
            "Fat"
          )}
          {renderedProgress(
            totalProtien.toFixed(2),
            75,
            "#e759b6",
            "#c0c2de",
            "Protien"
          )}
        </View>
        <View
          style={{
            marginTop: 85,
            marginHorizontal: 10,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#9987eb",
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            Total Calories, Fat, Protien consumed today
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <EvilIcons
          name="refresh"
          size={24}
          color="black"
          onPress={refreshData}
          style={{
            fontSize: 30,
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 10,
          }}
        />
        <Text style={{ marginRight: 10 }}>{currentDate}</Text>
      </View>
      <ScrollView>
        {itemsAddedToday.length > 0 ? (
          itemsAddedToday.map((item, index) => {
            return (
              <View
                key={index}
                style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}
              >
                <View
                  style={{
                    backgroundColor: "#9987eb",
                    padding: 10,
                    borderRadius: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <View style={{ flex: 1, gap: 5 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {item.label}
                    </Text>
                    <Text style={{ color: "#222134" }}>
                      {item.cal.toFixed(2)} cal, {item.category}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text>No data available</Text>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <EvilIcons
          name="arrow-left"
          size={24}
          color="black"
          onPress={handleBackArrowPress}
          style={{ fontSize: 30, marginLeft: 10 }}
        />
        <EvilIcons
          name="arrow-right"
          size={24}
          color="black"
          onPress={handleFrontArrowPress}
          style={{ fontSize: 30, marginLeft: 10 }}
        />
      </View>
    </View>
  );
};

export default MyFood;
