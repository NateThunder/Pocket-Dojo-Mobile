import { Text, View } from "react-native";

export default function Notes() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Notes</Text>
      <Text style={{ marginTop: 8, color: "#444" }}>Capture your training notes here.</Text>
    </View>
  );
}
