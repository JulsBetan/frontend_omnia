<template>
  <div class="inicio-container">


    <!-- Header -->
    <header class="header">
      <div class="logo-container">
        <img src="/assets/images/omniapro_horz_white_logo_no_background.png" alt="Omnia Pro Logo" class="logo">
      </div>
      <div class="user-actions">
        <p v-if="user">{{ user.user_metadata?.name || user.user_metadata?.full_name || user.email  }}</p>
        <button @click="cerrarSesion">Cerrar sesión</button>
      </div>
    </header>

    <header class="header2">
      <div class="search-bar">
        <input type="text" placeholder="Search" />
      </div>
    </header>
    <!-- Menu izquierdo -->
    <aside class="menu-vertical">
      <ul>
        <li>
          <img src="/assets/images/icons/pieIconW@3x.png" alt="Ícono de casa" class="menu-icon" >
          <span class="menu-text">Dashboard</span> <!-- Texto del menú -->

          

        </li>
        <li @mouseenter="mostrarSubmenu('administracion')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/projectIconW@3x.png" alt="Ícono de casa" class="menu-icon" >
          <span class="menu-text">Administración</span>

          <!-- Submenú para "Administracion" -->
          <ul v-if="submenuVisible === 'administracion'" class="submenu">
            <li>Empresas</li>
            <li>Unidades organizacionales</li>
            <li>Reglas fonde de ahorro</li>
          </ul>
        </li>
        <li>
          <img src="/assets/images/icons/personaIconW@3x.png" alt="Ícono de casa" class="menu-icon" >
          <span class="menu-text">Participantes</span>
        </li>
        <li>
          <span>⚙️</span> <!-- Ícono de ajustes -->
          <span class="menu-text">Ajustes</span>
        </li>
      </ul>
    </aside> 
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
const submenuVisible = ref(null); // Controla qué submenú está visible

// Mostrar el submenú correspondiente
const mostrarSubmenu = (menu) => {
  submenuVisible.value = menu;
};

// Ocultar el submenú
const ocultarSubmenu = () => {
  submenuVisible.value = null;
};

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
  background-color: #1a1026;
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

.menu-vertical {
  width: 40px; /* Ancho del menú */
  background-color: #1a1026; /* Color de fondo del menú */
  color: white; /* Color del texto */
  padding: 20px;
  border-radius: 15px; /* Esquinas redondeadas */
  margin: 10px; /* Margen para separar el menú del borde */
  transition: width 0.3s ease;
}

.menu-vertical:hover {
  width: 250px; /* Ancho expandido del menú (íconos + texto) */
}

.menu-vertical ul {
  list-style: none; /* Quita los puntos de la lista */
  padding: 0;
  margin: 0;
}

.menu-vertical li {
  display: flex;
  align-items: center;
  gap: 10px; /* Espacio entre el ícono y el texto */
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative; 
}

.menu-vertical li:hover {
  background-color: #34495e; /* Color de fondo al pasar el mouse */
}

.menu-text {
  opacity: 0; /* Oculta el texto por defecto */
  transition: opacity 0.3s ease; /* Transición suave para la opacidad */
}

.menu-vertical:hover .menu-text {
  opacity: 1; /* Muestra el texto al pasar el mouse */
}

.menu-icon {
  width: 20px; /* Ajusta el tamaño del ícono */
  height: 20px; /* Ajusta el tamaño del ícono */
}

.submenu {
  position: absolute;
  left: 100%; /* Posiciona el submenú a la derecha del menú principal */
  top: 0;
  width: 200px; /* Ancho del submenú */
  background-color: #1a1026; /* Color de fondo del submenú */
  border-radius: 8px; /* Esquinas redondeadas */
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra para el submenú */
  z-index: 10;
}

.submenu li {
  padding: 8px;
  border-radius: 4px;
  text-align: left;
}

.submenu li:hover {
  background-color: #2c3e50; /* Color de fondo al pasar el mouse */
}

</style>
