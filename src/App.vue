<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/client";

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();

    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        console.log("⚠️ No hay usuario autenticado, redirigiendo a login...");
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      // Obtener el timestamp de la última sesión activa
      const lastSignIn = new Date(data.user.last_sign_in_at).getTime();
      const now = new Date().getTime();

      // Definir tiempo máximo de sesión (ejemplo: 1 hora)
      const sessionExpiryTime = 5 * 60 * 1000; // 1 hora en milisegundos

      if (now - lastSignIn > sessionExpiryTime) {
        console.log("⚠️ Sesión expirada, cerrando sesión...");
        await supabase.auth.signOut();
        router.push("/login");
      }
    };

    onMounted(() => {
      // Verificar sesion al cargar la app
      checkSession();

      // Escuchar cambios en la autenticacion
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          console.log("Usuario autenticado globalmente:", session.user);
          router.push("/partidos"); // Redirigir a /partidos cuando se inicie sesión
        } else {
          console.log("Usuario deslogueado, redirigiendo a login...");
          router.push("/login");
        }

      });

      // Revisar cada 5 minutos si la sesion sigue activa
      serInterval(checkSession, 60 * 60 * 1000); // 5 minutos
    });

    return {};
  },
});
</script>

<template>
  <router-view />
</template>
