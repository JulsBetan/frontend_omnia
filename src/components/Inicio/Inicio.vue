<template>
  <div class="inicio-container">
    <!-- Header -->
    <header class="header">
      <div class="logo-container">
        <img src="/assets/images/omniapro_horz_white_logo_no_background.png" alt="Omnia Pro Logo" class="logo">
      </div>
      <div class="user-actions">
        <p v-if="user">{{ user.user_metadata.name }}</p>
        <button @click="cerrarSesion">Cerrar sesión</button>
      </div>
    </header>

    <header class="header2">
      <div class="search-bar">
        <input type="text" placeholder="Search" />
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      <div class="progress-indicator">
        <span>100% ▼</span>
      </div>
      <div class="notifications">
        <span>⏰</span>
        <span>⏰</span>
        <span>⏰</span>
        <span>⏰</span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore'; // Importa el store
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase/client';

const userStore = useUserStore();

const router = useRouter();

const user = ref(null);

onMounted(async () => {
  try {
    await userStore.fetchUser(); // Obtén el usuario desde el store
    user.value = userStore.user; // Asigna el usuario a la ref
    console.log('Usuario:', user.value); // Verifica la estructura del usuario
  } catch (error) {
    console.error('Error al obtener el usuario:', error.message);
  } 
});

// Función para cerrar sesión
const cerrarSesion = async () => {
  try {
    await supabase.auth.signOut(); // Cierra la sesión en Supabase
    userStore.clearUser(); // Limpia el usuario en el store
    router.push('/login'); // Redirige al usuario a la página de login
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  } 
};
</script>

<style scoped>
.inicio-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #834f99;
  border-bottom: 0px solid #ddd;
}

.header2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  background-color: #000000;
  border-bottom: 0px solid #ddd;
  padding: 10px 10px;
}
.app-name {
  font-size: 24px;
  font-weight: bold;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  background-color: #333333;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-actions button {
  padding: 8px 12px;
  background-color: #834f99;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-actions button:hover {
  background-color: #594198;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.progress-indicator {
  font-size: 20px;
  font-weight: bold;
}

.notifications {
  display: flex;
  gap: 10px;
}

.notifications span {
  font-size: 24px;
  cursor: pointer;
}

.logo-container {
  text-align: left;
  margin-left: 20px;
}

.logo {
  max-width: 15%;
  height: auto;
}
</style>
