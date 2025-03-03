<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/client";

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();
    let authListener: any;
    let sessionChecker: NodeJS.Timeout | null = null; // Inicializa como null
    const isMagicLinkFlow = ref(false); // Bandera para detectar el flujo del magic link

    const checkSession = async () => {
        console.log("⚠️  Check Sesión");
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.log("⚠️ No hay usuario autenticado, redirigiendo a login...");
        // await supabase.auth.signOut();
        router.push("/login");
        return false;
      }

      // Obtener el timestamp de la última sesión activa
      const lastSignIn = data.user.last_sign_in_at
        ? new Date(data.user.last_sign_in_at).getTime() : 0;
      const now = new Date().getTime();

      // Definir tiempo máximo de sesión (ejemplo: 1 hora)
      const sessionExpiryTime = 60 * 60 * 1000; // 1 hora en milisegundos

      if (now - lastSignIn > sessionExpiryTime) {
        console.log("⚠️ Sesión expirada, cerrando sesión...");
        await supabase.auth.signOut();
        router.push("/login");
        return  false;
      }
      return true;
    }; // checkSession


    const handleAuthStateChange = async (event: string, session: Session | null) => {
      if (event === "SIGNED_IN" && session?.user) {
        console.log("Usuario autenticado:", session.user);
        isMagicLinkFlow.value = false; // Restablecer la bandera

        const profileExistsKey = `profile_exists_${session.user.id}`;
        if (localStorage.getItem(profileExistsKey)) {
          console.log("✅ Perfil ya marcado en localStorage, evitando consulta.");
          //router.push("/partidos");
          return;
        }

        try {
          const { data: existingProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (!existingProfile && !fetchError) {
            console.log("Insertando perfil...");
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
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
              localStorage.setItem(profileExistsKey, "true");
            }
          } else {
            console.log("Perfil ya existe en el backend.");
            localStorage.setItem(profileExistsKey, "true");
          }
        } catch (err) {
          console.error("Error verificando perfil:", err);
        }

        // Redirigir solo si no esta en una ruta protegida
        if (router.currentRoute.value.path !== "/inicio") {
          router.push("/inicio");
        }
      } else if (event === "SIGNED_OUT") {
        if (isMagicLinkFlow.value) {
          console.log("🔑 Magic link en proceso, ignorando SIGNED_OUT...");
          return; // Ignorar SIGNED_OUT si es parte del flujo del magic link
        }

        console.log("🚪 Usuario cerró sesión, limpiando localStorage...");
        localStorage.clear();
        router.push("/login");
      }
    };

    onMounted(async () => {
      
      // Registrar el listener de cambios de estado de autenticación.
      authListener = supabase.auth.onAuthStateChange(handleAuthStateChange);

      // Verificar la sesión activa inmediatamente.
      const isAuthenticated = await checkSession();

      if (isAuthenticated) {
        console.log("Usuario autenticado, verificando perfil...");
        const { data: session } = await supabase.auth.getSession();

        if (session?.session?.user) {
          await handleAuthStateChange("SIGNED_IN", session.session);
        }

        // Revisar cada 5 minutos si la sesión sigue activa.
        sessionChecker = setInterval(checkSession, 5 * 60 * 1000); // 5 minutos
      }

      // Detectar si el usuario está en el flujo del magic link
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("type") && urlParams.get("type") === "magiclink") {
        isMagicLinkFlow.value = true; // Activar la bandera
        console.log("Es magiclink flow");
      } else {
          console.log("No es magiclink flow");
      }
    });

    onBeforeUnmount(() => {
      // Desregistrar el listener cuando el componente se destruya.
      if (authListener) {
        authListener.unsubscribe();
        console.log("Auth listener eliminado.");
      }

      // Limpiar el setInterval cuando el componente se destruya.
      if (sessionChecker) {
        clearInterval(sessionChecker);
        console.log("Intervalo de verificación de sesión eliminado.");
      }
    });

    return {};
  },
});
</script>

<template>
  <router-view />
</template>
