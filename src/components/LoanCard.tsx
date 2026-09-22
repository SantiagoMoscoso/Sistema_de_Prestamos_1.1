// src/components/LoanCard.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { Loan } from "../types/loan";
import { calculateBalance } from "../utils/loanCalculations";
import { useLoans } from "../hooks/useLoans";
import { historyStyles } from "../styles/historyStyles";

type Props = {
  loan: Loan;
};

// Diccionario para no repetir if/else de colores y texto en el JSX
const statusInfo = {
  approved: { label: "Al día", color: "#2F6F5E" },
  mora: { label: "En mora", color: "#B3261E" },
  paid: { label: "Pagado", color: "#5C6B64" },
};

export default function LoanCard({ loan }: Props) {
  // Estado LOCAL de este card, no del Context: cada tarjeta tiene su
  // propio input de pago, independiente de las demás
  const [paymentText, setPaymentText] = useState("");
  const [message, setMessage] = useState("");

  const { registerPayment, markAsMora } = useLoans();

  const balance = calculateBalance(loan);
  const status = statusInfo[loan.status];

  const handlePay = () => {
    const amount = Number(paymentText);
    const result = registerPayment(loan.id, amount);

    setMessage(result.message);
    if (result.success) {
      setPaymentText(""); // limpiamos el input solo si el pago fue válido
    }
  };

  return (
    <View style={historyStyles.card}>
      <View style={historyStyles.cardHeader}>
        <Text style={historyStyles.amount}>
          ${loan.amount.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
        </Text>
        {/* Badge de estado, con el color según el diccionario de arriba */}
        <View style={[historyStyles.badge, { backgroundColor: status.color }]}>
          <Text style={historyStyles.badgeText}>{status.label}</Text>
        </View>
      </View>

      <Text style={historyStyles.detail}>
        {loan.installments} cuotas de $
        {loan.installmentValue.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
      </Text>
      <Text style={historyStyles.detail}>
        Saldo pendiente: ${balance.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
      </Text>

      {/* Solo mostramos el formulario de pago si el préstamo no está pagado */}
      {loan.status !== "paid" && (
        <>
          <View style={historyStyles.payRow}>
            <TextInput
              style={historyStyles.payInput}
              placeholder="Valor a pagar"
              placeholderTextColor="#9AA6A0"
              value={paymentText}
              onChangeText={setPaymentText}
              keyboardType="numeric"
            />
            <TouchableOpacity style={historyStyles.payButton} onPress={handlePay}>
              <Text style={historyStyles.payButtonText}>Pagar</Text>
            </TouchableOpacity>
          </View>

          {message ? <Text style={historyStyles.message}>{message}</Text> : null}

          {/* Botón manual para probar la regla de mora, ver nota al inicio */}
          {loan.status === "approved" && (
            <TouchableOpacity onPress={() => markAsMora(loan.id)}>
              <Text style={historyStyles.moraLink}>Marcar como mora (prueba)</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}