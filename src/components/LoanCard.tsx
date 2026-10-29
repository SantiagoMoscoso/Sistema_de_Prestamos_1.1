// src/components/LoanCard.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { Loan } from "../types/loan";
import { useLoans } from "../hooks/useLoans";
import { historyStyles } from "../styles/historyStyles";

type Props = {
  loan: Loan;
};

const statusInfo = {
  approved: { label: "Al día", color: "#2F6F5E" },
  mora: { label: "En mora", color: "#B3261E" },
  paid: { label: "Pagado", color: "#5C6B64" },
};

export default function LoanCard({ loan }: Props) {
  const [paymentText, setPaymentText] = useState("");
  const [message, setMessage] = useState("");

  const { registerPayment } = useLoans();

  // Ya no se calcula con calculateBalance(loan) — viene directo del backend,
  // ya calculado, en loan.balance (con ?? 0 por si acaso llega undefined)
  const balance = loan.balance ?? 0;
  const status = statusInfo[loan.status];

  const handlePay = async () => {
    const amount = Number(paymentText);

    // await, porque registerPayment ahora es async (hace una petición al backend)
    const result = await registerPayment(loan.id, amount);

    setMessage(result.message);
    if (result.success) {
      setPaymentText("");
    }
  };

  return (
    <View style={historyStyles.card}>
      <View style={historyStyles.cardHeader}>
        <Text style={historyStyles.amount}>
          ${loan.amount.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
        </Text>
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

          {/* El botón "Marcar como mora" se quitó: ya no existe en LoansContext
              porque el backend no tiene un endpoint para esa acción */}
        </>
      )}
    </View>
  );
}