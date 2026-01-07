import { View, ScrollView, StyleSheet, Alert } from 'react-native'; // <--- Añadido Alert
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN DE LOGOUT ---
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
    // No hace falta redirigir manualmente, el AuthGuard en _layout.tsx lo hará por ti.
  };

  const fetchMyVehicles = async () => {
    if (!session?.user.id) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('*');
    
    if (data) setVehicles(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyVehicles();
    }, [session])
  );

  // --- ESTADO VACÍO ---
  if (!loading && vehicles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text size="2xl" bold style={{marginBottom: 10}}>🚗 Garaje Vacío</Text>
        <Text style={{textAlign: 'center', marginBottom: 30, color: 'gray'}}>
          Aún no has añadido ningún vehículo. ¡Añade el primero para empezar a controlar sus gastos!
        </Text>
        
        <Button size="lg" onPress={() => router.push('/add-car')}>
          <ButtonText>Añadir mi primer coche</ButtonText>
        </Button>

        {/* Botón Logout en estado vacío */}
        <Button variant="link" onPress={handleLogout} style={{marginTop: 20}}>
          <ButtonText style={{color: '#d9534f'}}>Cerrar Sesión</ButtonText>
        </Button>
      </View>
    );
  }

  // --- ESTADO CON COCHES ---
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabecera con título y botón de salir pequeño */}
      <View style={styles.headerRow}>
        <Text size="xl" bold>Mis Vehículos</Text>
        <Button size="xs" variant="link" onPress={handleLogout}>
          <ButtonText style={{color: '#d9534f'}}>Salir</ButtonText>
        </Button>
      </View>

      {vehicles.map((coche) => (
        <View key={coche.id} style={styles.carCard}>
          <Text bold size="lg">{coche.alias}</Text>
          <Text>{coche.brand} {coche.model}</Text>
        </View>
      ))}

      <Button variant="outline" style={{marginTop: 20}} onPress={() => router.push('/add-car')}>
        <ButtonText>Añadir otro coche</ButtonText>
      </Button>

      {/* Botón Logout grande al final (Opcional) */}
      <Button 
        variant="outline" 
        action="negative" // Si tu tema lo soporta, saldrá rojo. Si no, usa style.
        style={{marginTop: 40, borderColor: '#d9534f'}} 
        onPress={handleLogout}
      >
        <ButtonText style={{color: '#d9534f'}}>Cerrar Sesión</ButtonText>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#f5f5f5' },
  container: { padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, // <--- Nuevo estilo para cabecera
  carCard: { padding: 20, backgroundColor: 'white', borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }
});