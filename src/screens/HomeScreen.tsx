import { View, Text, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";
import { homeStyles } from "../styles/homeStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // replace en vez de navigate: saca a Home del historial,
    // así el usuario no puede volver a Home con el botón de atrás
    navigation.replace("Login");
  };

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.greeting}>Hola de nuevo,</Text>
        {/* currentUser puede ser null en teoría (según el tipo), por eso el "?." */}
        <Text style={homeStyles.userName}>{currentUser?.name}</Text>
      </View>

      <TouchableOpacity
        style={homeStyles.actionCard}
        onPress={() => navigation.navigate("Loan")}
      >
        <Text style={homeStyles.actionTitle}>Solicitar préstamo</Text>
        <Text style={homeStyles.actionSubtitle}>Pide un nuevo préstamo en minutos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={homeStyles.actionCard}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={homeStyles.actionTitle}>Historial</Text>
        <Text style={homeStyles.actionSubtitle}>Revisa tus préstamos y pagos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={homeStyles.logoutButton} onPress={handleLogout}>
        <Text style={homeStyles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}