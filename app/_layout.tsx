import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

// Componente que vigila la navegación
function AuthGuard() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Si tuviéramos grupo auth
    // const inAuthGroup = segments[0] === '(auth)'; 
    
    if (!session && segments[0] !== 'login') {
      // Si no hay sesión y no estamos en login, mándalo al login
      router.replace('/login');
    } else if (session && segments[0] === 'login') {
      // Si ya hay sesión y está en login, mándalo al inicio
      router.replace('/');
    }
  }, [session, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <AuthProvider>
        <AuthGuard />
      </AuthProvider>
    </GluestackUIProvider>
  );
}