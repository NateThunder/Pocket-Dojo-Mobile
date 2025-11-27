import { Text, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ZoomableContainer from "../../components/ZoomableContainer";

export default function FlowTrainer() {
  return (
    <ZoomableContainer>
      <View style={{ position: "relative", alignItems: "center" }}>
        <MaterialCommunityIcons
          name="information-variant"
          size={24}
          color="black"
          style={{ position: "absolute", top: -25, left: 0 }}
        />
        <Ionicons
          name="play-circle-outline"
          size={24}
          color="black"
          style={{ position: "absolute", top: -25, right: 0 }}
        />
        <View
          style={{
            width: 120,
            height: 60,
            borderRadius: 12,
            backgroundColor: "#f8f8f8",
            borderWidth: 1,
            borderColor: "#dcdcdc",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#222" }}>
            Start Here
          </Text>
        </View>
        <FontAwesome6
          name="plus"
          size={20}
          color="black"
          style={{ position: "absolute", right: -30, top: 18 }}
        />
      </View>
    </ZoomableContainer>
  );
}
