import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen
        name="flow-trainer"
        options={{
          title: "Flow Trainer",
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="partition" size={size ?? 24} color={color ?? "black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size ?? 24} color={color ?? "black"} />
          ),
        }}
      />
    </Tabs>
  );
}
