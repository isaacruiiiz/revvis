import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
// Gluestack components
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack'; // Necesitarás instalar vstack: npx gluestack-ui@latest add vstack

export default function AddCarScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [alias, setAlias] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  async function handleCreateCar() {
    if (!alias || !brand || !model) {
      Alert.alert("Faltan datos", "Rellena todo, por favor.");
      return;
    }
    setLoading(true);
  
    // 1. OBTENEMOS EL ID DEL USUARIO AHORA MISMO
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      setLoading(false);
      Alert.alert("Error", "No estás identificado.");
      return;
    }
  
    console.log("Enviando datos...", { alias, brand, model, user_id: user.id });
  
    // 2. LO ENVIAMOS MANUALMENTE
    const { error } = await supabase.from('vehicles').insert({
      alias,
      brand,
      model,
      user_id: user.id // <--- ESTO ES LA CLAVE SI EL AUTOMÁTICO FALLA
    });
  
    setLoading(false); // <--- Importante: apagar el spinner pase lo que pase
  
    if (error) {
      console.error("Error al guardar:", error); // Míralo en la terminal
      Alert.alert("Error al guardar", error.message);
    } else {
      Alert.alert("¡Éxito!", "Coche guardado");
      router.back(); 
    }
  }

  return (
    <View style={styles.container}>
      <Text size="xl" bold style={{marginBottom: 30}}>Nuevo Vehículo</Text>
      
      <VStack space="md">
        <View>
           <Text bold size="sm" style={{marginBottom:5}}>Nombre / Alias (Ej: "El rojito")</Text>
            <Input variant="outline" size="md"><InputField value={alias} onChangeText={setAlias} placeholder="¿Cómo lo llamas?"/></Input>
        </View>

        <View>
           <Text bold size="sm" style={{marginBottom:5}}>Marca (Ej: Toyota)</Text>
           <Input variant="outline" size="md"><InputField value={brand} onChangeText={setBrand} /></Input>
        </View>

        <View>
           <Text bold size="sm" style={{marginBottom:5}}>Modelo (Ej: Corolla)</Text>
           <Input variant="outline" size="md"><InputField value={model} onChangeText={setModel} /></Input>
        </View>

        <Button size="lg" onPress={handleCreateCar} isDisabled={loading} style={{marginTop: 20}}>
          <ButtonText>{loading ? "Guardando..." : "Guardar Coche"}</ButtonText>
        </Button>

         <Button variant="link" onPress={() => router.back()} isDisabled={loading}>
          <ButtonText>Cancelar</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, paddingTop: 80, backgroundColor: '#fff' },
});