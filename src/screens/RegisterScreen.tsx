import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";
import { authStyles } from "../styles/authStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Necesitamos las dos funciones: register para crear el usuario,
  // login para abrir sesión automáticamente después
  const { register, login } = useAuth();

  const handleRegister = () => {
    // Validación de campos vacíos, uno por uno para que el mensaje sea claro
    if (!name || !lastName || !email || !password) {
      setError("Completa todos los campos");
      return;
    }

    // Validación básica de formato de correo
    if (!email.includes("@")) {
      setError("Ingresa un correo válido");
      return;
    }

    const created = register({
      id: Date.now().toString(), // suficiente como id único para este alcance
      name,
      lastName,
      email,
      password,
    });

    if (!created) {
      setError("Ya existe una cuenta con ese correo");
      return;
    }

    // Registro exitoso: lo logueamos de una vez con las mismas credenciales
    setError("");
    login(email, password);
    navigation.replace("Home");
  };

  return (
    // ScrollView en vez de View: con 4 inputs + teclado abierto,
    // el contenido puede no caber en pantallas chicas
    <ScrollView contentContainerStyle={authStyles.container}>
      <View style={authStyles.card}>
        <Text style={authStyles.brand}>CrediFlow</Text>
        <View style={authStyles.brandUnderline} />
        <Text style={authStyles.subtitle}>Crea tu cuenta para empezar</Text>

        <Text style={authStyles.label}>Nombre</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Ana"
          placeholderTextColor="#9AA6A0"
          value={name}
          onChangeText={setName}
        />

        <Text style={authStyles.label}>Apellido</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Gómez"
          placeholderTextColor="#9AA6A0"
          value={lastName}
          onChangeText={setLastName}
        />

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

        {error ? <Text style={authStyles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={authStyles.button} onPress={handleRegister}>
          <Text style={authStyles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <View style={authStyles.linkRow}>
          <Text style={authStyles.linkText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={authStyles.linkAction}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}