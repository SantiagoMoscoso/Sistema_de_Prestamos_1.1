import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

// Este tipo le da a "navigation" y "route" el tipado correcto para ESTA pantalla específica
type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      {/* navigation.navigate cambia de pantalla dentro del stack */}
      <Button title="Ir a Register" onPress={() => navigation.navigate("Register")} />
      <Button title="Ir a Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}