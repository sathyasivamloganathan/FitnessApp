import { Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
const FoodListItem = ({ item, onPress }) => {
  return (
    <View
      style={{
        backgroundColor: "#f6f6f8",
        padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.label}</Text>
        <Text style={{ color: "dimgray" }}>
          {item.cal.toFixed(2)} cal, {item.category}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onPress(item)}>
        <AntDesign name="pluscircleo" size={24} color="royalblue" />
      </TouchableOpacity>
    </View>
  );
};

export default FoodListItem;