import { Tabs } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const activeColor = "white"
const Layout = () => {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarActiveBackgroundColor: "#826be7",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="MyFood"
          options={{
            tabBarLabel: "MyFood",
            tabBarIcon: () => (
              <Ionicons name="fast-food-outline" size={24} color={"black"} />
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            tabBarLabel: "Search",
            tabBarIcon: () => (
              <AntDesign name="search1" size={24} color={"black"} />
            ),
          }}
        />
      </Tabs>
    );
}

export default Layout;