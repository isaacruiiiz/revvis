import React, { useState } from 'react';
import { View, StyleSheet, Alert, AppState } from 'react-native';
import { supabase } from '../supabase';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from 'react-native';

// Gestión de refresco de sesión
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Iniciar Sesión
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error al entrar', error.message);
    setLoading(false);
  }

  // Registrarse
  async function signUpWithEmail() {
    console.log("1. Botón pulsado"); // <--- NUEVO
    setLoading(true);
    
    console.log("2. Enviando datos a Supabase...", email); // <--- NUEVO

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    console.log("3. Respuesta recibida:", data, error); // <--- NUEVO

    setLoading(false);

    if (error) {
      console.log("4. Hubo un error:", error.message); // <--- NUEVO
      Alert.alert('Error al registrarse', error.message);
      return;
    }

    if (data.session) {
      console.log("5. ¡Éxito! Tenemos sesión."); // <--- NUEVO
    } else {
      console.log("5. Usuario creado pero SIN sesión (confirmación email pendiente)."); // <--- NUEVO
      Alert.alert('Verifica tu correo', 'Revisa tu email para confirmar.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AutoSync 🚗</Text>
      
      <View style={styles.inputContainer}>
        <Input variant="outline" size="md">
          <InputField 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
          />
        </Input>
      </View>
      
      <View style={styles.inputContainer}>
        <Input variant="outline" size="md">
           <InputField 
             placeholder="Contraseña" 
             value={password} 
             onChangeText={setPassword} 
             secureTextEntry={true} 
             autoCapitalize="none"
           />
        </Input>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={signInWithEmail} isDisabled={loading}>
          <ButtonText>{loading ? "Cargando..." : "Iniciar Sesión"}</ButtonText>
        </Button>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={signUpWithEmail} isDisabled={loading} variant="outline">
          <ButtonText>Registrarse</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
  inputContainer: { marginBottom: 15 },
  buttonContainer: { marginTop: 10 },
});