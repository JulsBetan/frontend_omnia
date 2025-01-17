<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/client";

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();

    onMounted(() => {
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          console.log("Usuario autenticado globalmente:", session.user);
          router.push("/partidos"); // Redirigir a /partidos cuando se inicie sesión
        }
      });
    });

    return {};
  },
});
</script>

<template>
  <router-view />
</template>
