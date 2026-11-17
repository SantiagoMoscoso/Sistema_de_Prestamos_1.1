import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { getPendingLoans, approveLoan, rejectLoan } from "../services/apiService";
import type { PendingLoan } from "../types/loan";
import { adminStyles } from "../styles/adminStyles";

const money = (n: number) => `$${n.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

export default function AdminScreen() {
  const { currentUser, logout } = useAuth();
  const [loans, setLoans] = useState<PendingLoan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Pide la lista de pendientes al backend
  const loadLoans = async () => {
    setIsLoading(true);
    setLoans(await getPendingLoans());
    setIsLoading(false);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleDecision = async (id: string, action: "approve" | "reject") => {
    const result = action === "approve" ? await approveLoan(id) : await rejectLoan(id);
    setMessage(result.message);
    await loadLoans(); // refresca: el préstamo decidido ya no está pendiente
  };

  return (
    <View style={adminStyles.container}>
      <View style={adminStyles.header}>
        <View>
          <Text style={adminStyles.title}>Panel de administrador</Text>
          <Text style={adminStyles.subtitle}>{currentUser?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={adminStyles.logout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {message ? <Text style={adminStyles.message}>{message}</Text> : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="#2F6F5E" />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={adminStyles.emptyText}>No hay solicitudes pendientes.</Text>
          }
          renderItem={({ item }) => (
            <View style={adminStyles.card}>
              <Text style={adminStyles.client}>{item.clientName}</Text>
              <Text style={adminStyles.detail}>{item.email}</Text>
              <Text style={adminStyles.amount}>{money(item.amount)}</Text>
              <Text style={adminStyles.detail}>
                {item.installments} cuotas de {money(item.installmentValue)}
              </Text>

              {/* Resultado de las reglas, calculado por el backend */}
              {item.rules.ok ? (
                <Text style={adminStyles.rulesOk}>Cumple las reglas</Text>
              ) : (
                item.rules.reasons.map((reason) => (
                  <Text key={reason} style={adminStyles.rulesFail}>• {reason}</Text>
                ))
              )}

              <View style={adminStyles.actions}>
                <TouchableOpacity
                  style={[adminStyles.approve, !item.rules.ok && adminStyles.disabled]}
                  disabled={!item.rules.ok}
                  onPress={() => handleDecision(item.id, "approve")}
                >
                  <Text style={adminStyles.approveText}>Aprobar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={adminStyles.reject}
                  onPress={() => handleDecision(item.id, "reject")}
                >
                  <Text style={adminStyles.rejectText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}