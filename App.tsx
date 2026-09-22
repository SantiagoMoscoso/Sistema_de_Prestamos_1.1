import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { LoansProvider } from "./src/context/LoansContext";

export default function App() {
  return (
    <AuthProvider>
      <LoansProvider>
        <AppNavigator />
      </LoansProvider>
    </AuthProvider>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

