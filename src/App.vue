<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/client";

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.log("⚠️ No hay usuario autenticado, redirigiendo a login...");
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      // Obtener el timestamp de la última sesión activa
      const lastSignIn = new Date(data.user.last_sign_in_at).getTime();
      const now = new Date().getTime();

      // Definir tiempo máximo de sesión (ejemplo: 1 hora)
      const sessionExpiryTime = 60 * 60 * 1000; // 1 hora en milisegundos

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
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          console.log("Usuario autenticado:", session.user);
          console.log("Usuario autenticado 2:");
          router.push("/partidos");

          try {
              // Verificar si el usuario ya tiene perfil en la base de datos
              //const { data: existingProfile, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

              let existingProfile: any = null; // Inicializar en null

              if (!existingProfile && !error) {
                // Insertar el perfil del usuario en la base de datos
                const { error: insertError } = await supabase.from("profiles").insert([
                  {
                    id: session.user.id,
                    first_name: session.user.user_metadata?.firstName || "",
                    last_name: session.user.user_metadata?.lastName || "",
                    middle_name: session.user.user_metadata?.middleName || "",
                    country_code: session.user.user_metadata?.countryCode || "",
                    phone_number: session.user.user_metadata?.phoneNumber || "",
                  },
                ]);

                if (insertError) {
                  console.error("Error guardando perfil:", insertError);
                } else {
                  console.log("Perfil guardado correctamente en el backend");
                }
              } else {
                console.log("Perfil ya existe en el backend")
              }
          } catch (err) {
            console.error("Error verificando perfil:", err);
          }
          console.log("Debe ir a partidos")         
          router.push("/partidos"); // Redirigir a /partidos cuando se inicie sesión
        } else {
          console.log("Usuario deslogueado, redirigiendo a login...");
          router.push("/login");
        }

      });

      // Revisar cada 5 minutos si la sesion sigue activa
      setInterval(checkSession, 5 * 60 * 1000); // 5 minutos
    });

    return {};
  },
});
</script>

<template>
  <router-view />
</template>
