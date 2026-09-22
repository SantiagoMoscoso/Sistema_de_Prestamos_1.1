// src/screens/HistoryScreen.tsx
import { View, Text, FlatList } from "react-native";
import { useLoans } from "../hooks/useLoans";
import LoanCard from "../components/LoanCard";
import { historyStyles } from "../styles/historyStyles";

export default function HistoryScreen() {
  const { getUserLoans } = useLoans();
  const loans = getUserLoans();

  // Sin préstamos, mostramos un mensaje en vez de una lista vacía y muda
  if (loans.length === 0) {
    return (
      <View style={historyStyles.container}>
        <Text style={historyStyles.emptyText}>
          Aún no tienes préstamos. Solicita uno desde el inicio.
        </Text>
      </View>
    );
  }

  return (
    <View style={historyStyles.container}>
      {/* FlatList en vez de .map() + ScrollView: es más eficiente en RN,
          solo renderiza lo que está visible en pantalla */}
      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LoanCard loan={item} />}
      />
    </View>
  );
}