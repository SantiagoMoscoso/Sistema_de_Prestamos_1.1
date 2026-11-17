import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import LoanScreen from "../screens/LoanScreen";
import HistoryScreen from "../screens/HistoryScreen";

// Creamos el stack pasándole el tipo, así cada Screen abajo queda validada
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { currentUser, isLoading } = useAuth();

  // Mientras leemos SecureStore no sabemos si hay sesión: mostramos un spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2F6F5E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          // Con sesión: solo existen estas pantallas
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Loan" component={LoanScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        ) : (
          // Sin sesión: solo estas
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}