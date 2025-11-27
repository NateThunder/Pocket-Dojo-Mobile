import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from "@expo/vector-icons/Foundation";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="flow-trainer" screenOptions={{ headerTitleAlign: "center" }}>
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
        name="notes"
        options={{
          title: "Notes",
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <Foundation name="clipboard-notes" size={size ?? 24} color={color ?? "black"} />
          ),
        }}
      />
    </Tabs>
  );
}
