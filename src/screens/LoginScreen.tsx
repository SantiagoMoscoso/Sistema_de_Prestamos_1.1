import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";
import { authStyles } from "../styles/authStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  // Estado local: lo que el usuario va escribiendo en los inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Traemos la función login desde el Context, vía el hook
  const { login } = useAuth();

  const handleLogin = () => {
    // Validación simple antes de intentar el login
    if (!email || !password) {
      setError("Ingresa tu correo y contraseña");
      return;
    }

    const success = login(email, password);

    if (!success) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    // Login correcto: limpiamos el error y navegamos a Home.
    // "replace" en vez de "navigate" para que el usuario no pueda
    // volver al Login con el botón de atrás una vez adentro.
    setError("");
    navigation.replace("Home");
  };

  return (
    <View style={authStyles.container}>
      <View style={authStyles.card}>
        <Text style={authStyles.brand}>CrediFlow</Text>
        <View style={authStyles.brandUnderline} />
        <Text style={authStyles.subtitle}>Ingresa a tu cuenta para continuar</Text>

        <Text style={authStyles.label}>Correo</Text>
        <TextInput
          style={authStyles.input}
          placeholder="tucorreo@ejemplo.com"
          placeholderTextColor="#9AA6A0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={authStyles.label}>Contraseña</Text>
        <TextInput
          style={authStyles.input}
          placeholder="••••••••"
          placeholderTextColor="#9AA6A0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* El texto de error solo aparece si hay algo que mostrar */}
        {error ? <Text style={authStyles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
          <Text style={authStyles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <View style={authStyles.linkRow}>
          <Text style={authStyles.linkText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={authStyles.linkAction}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}