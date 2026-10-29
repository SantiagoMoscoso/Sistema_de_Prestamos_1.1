import { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useLoans } from "../hooks/useLoans";
import LoanCard from "../components/LoanCard";
import { historyStyles } from "../styles/historyStyles";

export default function HistoryScreen() {
  const { loans, isLoadingLoans, refreshLoans } = useLoans();

  // Al entrar a esta pantalla, pedimos los préstamos actualizados al backend
  useEffect(() => {
    refreshLoans();
  }, []);

  if (isLoadingLoans) {
    return (
      <View style={historyStyles.container}>
        <ActivityIndicator size="large" color="#2F6F5E" />
      </View>
    );
  }

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
      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LoanCard loan={item} />}
      />
    </View>
  );
}