<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/client";
import type { Session, Subscription } from "@supabase/supabase-js";

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();
    let authListener: Subscription | null = null;
    let sessionChecker: NodeJS.Timeout | null = null;

    const isMagicLinkFlow = ref(false);
    const initialSessionChecked = ref(false);
    const sessionRestored = ref(false);

    const checkSession = async () => {
      console.log("⚠️ Check Sesión");
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.log("⚠️ No hay usuario autenticado, redirigiendo a login...");
        await supabase.auth.signOut();
        router.push("/login");
        return false;
      }

      return true;
    };

    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log(`🟡 Evento de autenticación detectado: ${event}`);
      console.log(`🌍 Ruta actual antes de procesar evento: ${router.currentRoute.value.path}`);

      if (event === "INITIAL_SESSION") {
        if (initialSessionChecked.value) {
          console.log("🔄 Sesión inicial ya procesada, ignorando evento duplicado.");
          return;
        }
        console.log("🔄 Sesión inicial detectada, evitando redirección.");
        initialSessionChecked.value = true;
        sessionRestored.value = !!session?.user;
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        if (sessionRestored.value) {
          console.log("🚀 Sesión ya restaurada, ignorando evento SIGNED_IN.");
          return;
        }

        console.log("Usuario autenticado:", session.user);
        isMagicLinkFlow.value = false;

        const profileExistsKey = `profile_exists_${session.user.id}`;
        if (localStorage.getItem(profileExistsKey)) {
          console.log("✅ Perfil ya marcado en localStorage, evitando consulta.");

          if (!router.currentRoute.value.path.startsWith("/inicio")) {
            console.log(`## Mandando a INICIO: ${event}`);
            router.push("/inicio");
          } else {
            console.log("🔄 Ya estamos en una subruta de /inicio, no redirigir.");
          }
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

        if (!router.currentRoute.value.path.startsWith("/inicio")) {
          console.log(`@@ Mandando a INICIO: ${event}`);
          router.push("/inicio");
        }
      } else if (event === "SIGNED_OUT") {
        if (isMagicLinkFlow.value) {
          console.log("🔑 Magic link en proceso, ignorando SIGNED_OUT...");
          return;
        }

        console.log("🚪 Usuario cerró sesión, limpiando localStorage...");
        localStorage.clear();
        router.push("/login");
      }
    };

    onMounted(async () => {
      console.log("🔄 Obteniendo sesión antes de registrar el listener...");
      const { data: session } = await supabase.auth.getSession();

      if (session?.session?.user) {
        console.log("✅ Usuario ya autenticado antes de registrar el listener");
        sessionRestored.value = true;
        initialSessionChecked.value = true; // Evita procesamiento innecesario de INITIAL_SESSION

        // 🚀 Esperar a que Vue Router detecte la ruta correcta antes de redirigir
        await new Promise((resolve) => setTimeout(resolve, 100));
      
        // 🚀 Nueva validación: Solo redirigir a "/inicio" si estamos en "/" o "/login"
        const currentPath = router.currentRoute.value.path;
        console.log(`🌍 Ruta actual después del reload: ${currentPath}`);

    
        if (currentPath === "/" || currentPath === "/login") {
          console.log("🔄 Redirigiendo a /inicio después de autenticación.");
          router.push("/inicio");
        } else {
          console.log(`✅ Usuario ya está en ${currentPath}, no redirigir.`);
        }      
      }

      console.log("🔄 Registrando listener de Supabase");
      authListener = supabase.auth.onAuthStateChange(handleAuthStateChange).data.subscription; 

      sessionChecker = setInterval(async () => {
        const isValid = await checkSession();
        if (!isValid && sessionChecker) {
          clearInterval(sessionChecker);
        }
      }, 5 * 60 * 1000);

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("type") && urlParams.get("type") === "magiclink") {
        isMagicLinkFlow.value = true;
        console.log("Es magiclink flow");
      } else {
        console.log("No es magiclink flow");
      }
    });

    onBeforeUnmount(() => {
      if (authListener) {
        authListener.unsubscribe();
        console.log("Auth listener eliminado.");
      }

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
