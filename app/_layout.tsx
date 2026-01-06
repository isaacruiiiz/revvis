import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Importamos nuestra conexión
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"; // Configuración de Gluestack

export default function App() {
  const [coches, setCoches] = useState([]);

  // Esta función pide los datos a Supabase
  async function fetchCoches() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*');

    if (error) console.log('Error:', error);
    else setCoches(data);
  }

  // Se ejecuta al iniciar la app
  useEffect(() => {
    fetchCoches();
  }, []);

  return (
    <GluestackUIProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Mis Coches (Desde Supabase):</Text>

        {coches.map((coche) => (
          <Text key={coche.id} style={styles.item}>
            🚗 {coche.brand} - {coche.model}
          </Text>
        ))}

        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    fontSize: 16,
    margin: 5,
  }
});