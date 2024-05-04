import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Alert,
  Text,
} from "react-native";
import FoodListItem from "../components/FoodListItem";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { Camera } from "expo-camera";


export default function Search() {
  const [foodName, setFoodName] = useState("");
  const [foodData, setFoodData] = useState([]);
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [cameraScanned, setCameraScanned] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  // requestPermission();
  useEffect(() => {
    requestPermission();
  }, [])

  console.log(permission)

  useEffect(() => {
    if(cameraScanned) {
      scannerFoodAdd(cameraScanned);
    }
  }, [cameraScanned])

  const performSearch = async () => {
    try {
      const res = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=26b1719a&app_key=88ab4c6d8dc4256658d6f64772473205&ingr=${foodName}&nutrition-type=cooking`
      );
      const data = await res.json();
      console.log(data);
      setFoodData(data.hints);
    } catch (err) {
      console.log(err);
    }
  };

  const addToLocalStorage = async (item) => {
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const newItem = { ...item, timestamp };
      const existingData = await AsyncStorage.getItem("myFood");
      if (existingData) {
        try {
          const existingItems = JSON.parse(existingData);
          const updatedItems = [...existingItems, newItem];
          console.log("UpdatedItems: ", updatedItems);
          await AsyncStorage.setItem("myFood", JSON.stringify(updatedItems));
          Alert.alert("Food added successfully");
        } catch (error) {
          console.log("Error at Search Data");
        }
      } else {
        await AsyncStorage.setItem("myFood", JSON.stringify([newItem]));
        Alert.alert("Food added successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scannerFoodAdd = async(barCodeData) => {
    try {
      const res = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=26b1719a&app_key=88ab4c6d8dc4256658d6f64772473205&upc=${barCodeData.data}&nutrition-type=cooking`
      );
      const data = await res.json();
      console.log("Barcode Data", barCodeData.data)
      console.log("Barcode api",data);
      console.log(data)
      setFoodData(data.hints);
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     requestPermission(status === "granted");
  //   })();
  // }, []);

  // const handleBarCodeScanned = ({ type, data }) => {
  //   setScannerEnabled(true);
  //   console.log(data, type);
  // };

  // if (permission === null) {
  //   return <Text>Requesting camera permission</Text>;
  // }

  // if (permission === false) {
  //   return <Text>No access to camera</Text>;
  // }
  if (scannerEnabled) {
    return (
      <View>
        <Camera
          onBarCodeScanned={({data}) => {
            setScannerEnabled(false);
            setCameraScanned({data})
            setFoodName(null)
          }}
          style={{ width: "100%", height: "100%" }}
          // type={Camera.Constants.Type.back}
        />

        <AntDesign
          onPress={() => setScannerEnabled(false)}
          name="close"
          size={30}
          color="dimgray"
          style={{ position: "absolute", right: 10, top: 10 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          value={foodName}
          placeholder="Search"
          style={styles.input}
          onChangeText={setFoodName}
        />
        <AntDesign
          name="barcode"
          onPress={() => setScannerEnabled(true)}
          size={32}
          color="dimgray"
        />
      </View>

      {foodName && (
        <Button title="Search" color={"#826be7"} onPress={performSearch} />
      )}

      {foodData && foodData.length > 0 && (
        <FlatList
          data={foodData}
          renderItem={({ item }) => (
            <FoodListItem
              item={{
                label: item.food.label,
                category: item.food.category,
                cal: item.food.nutrients.ENERC_KCAL,
                fat: item.food.nutrients.FAT,
                protien: item.food.nutrients.PROCNT,
                fibre: item.food.nutrients.FIBTG,
              }}
              onPress={addToLocalStorage}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    justifyContent: "center",
    padding: 10,
    gap: 10,
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 20,
    flex: 1,
  },
});
