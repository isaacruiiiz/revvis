import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://akuadiweidzvfxlgjfsp.supabase.co'; // Mantén tu URL
const projectKey = 'sb_secret_QoPeeMvEkrRi0exJ4s_C6w_LsWEoD8D';    // Mantén tu clave ANON (la pública)

// Creamos un adaptador de almacenamiento personalizado
const SupabaseStorage = {
  getItem: (key) => {
    // Si estamos en web y no hay ventana (es el servidor), no hacemos nada
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(projectUrl, projectKey, {
  auth: {
    storage: SupabaseStorage, // Usamos nuestro adaptador protegido
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});