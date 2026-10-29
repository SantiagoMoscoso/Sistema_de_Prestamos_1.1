import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useLoans } from "../hooks/useLoans";
import { calculateInstallmentValue } from "../utils/loanCalculations";
import { loanStyles } from "../styles/loanStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Loan">;

export default function LoanScreen({ navigation }: Props) {
  const [amountText, setAmountText] = useState("");
  const [installmentsText, setInstallmentsText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { requestLoan } = useLoans();

  const amount = Number(amountText);
  const installments = Number(installmentsText);

  // Este preview sigue usando calculateInstallmentValue LOCAL —
  // no tiene sentido pedírselo al backend solo para mostrar un número
  // mientras el usuario todavía está escribiendo, antes de confirmar nada
  const showPreview = amount > 0 && installments > 0;
  const previewValue = showPreview ? calculateInstallmentValue(amount, installments) : 0;

  // async, porque ahora espera la respuesta real del backend
  const handleSubmit = async () => {
    const result = await requestLoan(amount, installments);

    if (!result.success) {
      setError(result.message);
      setSuccess("");
      return;
    }

    setError("");
    setSuccess(result.message);

    setTimeout(() => navigation.replace("Home"), 800);
  };

  return (
    <View style={loanStyles.container}>
      <View style={loanStyles.card}>
        <Text style={loanStyles.title}>Solicitar préstamo</Text>
        <Text style={loanStyles.subtitle}>
          Ingresa el monto y en cuántas cuotas quieres pagarlo
        </Text>

        <Text style={loanStyles.label}>Monto solicitado</Text>
        <TextInput
          style={loanStyles.input}
          placeholder="1000000"
          placeholderTextColor="#9AA6A0"
          value={amountText}
          onChangeText={setAmountText}
          keyboardType="numeric"
        />

        <Text style={loanStyles.label}>Número de cuotas (1 a 60)</Text>
        <TextInput
          style={loanStyles.input}
          placeholder="12"
          placeholderTextColor="#9AA6A0"
          value={installmentsText}
          onChangeText={setInstallmentsText}
          keyboardType="numeric"
        />

        {showPreview && (
          <View style={loanStyles.previewBox}>
            <Text style={loanStyles.previewLabel}>Valor por cuota</Text>
            <Text style={loanStyles.previewValue}>
              ${previewValue.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
            </Text>
          </View>
        )}

        {error ? <Text style={loanStyles.errorText}>{error}</Text> : null}
        {success ? <Text style={loanStyles.successText}>{success}</Text> : null}

        <TouchableOpacity style={loanStyles.button} onPress={handleSubmit}>
          <Text style={loanStyles.buttonText}>Confirmar solicitud</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}