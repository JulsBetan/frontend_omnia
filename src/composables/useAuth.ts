import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/client";

export function useAuth() {
  const user = ref<any>(null);
  const router = useRouter();

  const checkSession = async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data?.user ?? null;

    //  Obtener el timestamp de la última sesión activa
    const lastSignIn = new Date(user.value?.last_sign_in_at).getTime();
    const now = new Date().getTime();

    //  Definir tiempo máximo de sesión (ejemplo: 1 hora)
    const sessionExpiryTime = 60 * 60 * 1000; // 1 hora en milisegundos

    if (!user.value || now - lastSignIn > sessionExpiryTime) {
      console.log("Sesión expirada, cerrando sesión...");
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL, // Asegura que se envía la URL correcta
      },
    });

    if (error) {
      console.error("Error enviando Magic Link:", error.message);
    } else {
      console.log("Magic Link enviado a:", email);
    }
  };

  onMounted(() => {
    //  Revisar cada 5 minutos si la sesión sigue activa
    setInterval(checkSession, 5 * 60 * 1000); // 5 minutos
  });

  return { user, checkSession, signInWithMagicLink };
}
