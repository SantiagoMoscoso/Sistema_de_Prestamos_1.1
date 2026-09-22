import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useLoans } from "../hooks/useLoans";
import { calculateInstallmentValue } from "../utils/loanCalculations";
import { loanStyles } from "../styles/loanStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Loan">;

export default function LoanScreen({ navigation }: Props) {
  // Guardamos los inputs como texto porque así es como TextInput los entrega.
  // Los convertimos a número solo cuando los necesitamos calcular/enviar.
  const [amountText, setAmountText] = useState("");
  const [installmentsText, setInstallmentsText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { requestLoan } = useLoans();

  // Number("") da 0, así que el preview no se rompe si el campo está vacío
  const amount = Number(amountText);
  const installments = Number(installmentsText);

  // Solo calculamos y mostramos el preview si ambos campos tienen algo válido
  const showPreview = amount > 0 && installments > 0;
  const previewValue = showPreview ? calculateInstallmentValue(amount, installments) : 0;

  const handleSubmit = () => {
    // requestLoan ya hace las validaciones de negocio (monto, cuotas, mora)
    // y nos devuelve el resultado exacto de qué pasó
    const result = requestLoan(amount, installments);

    if (!result.success) {
      setError(result.message);
      setSuccess("");
      return;
    }

    setError("");
    setSuccess(result.message);

    // Pequeña pausa para que el usuario alcance a leer el mensaje de éxito
    // antes de que lo regresemos a Home
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