<template>
  <div class="inicio-container">


    <!-- Header -->
    <header class="header">
      <div class="logo-container">
        <img src="/assets/images/omniapro_horz_white_logo_no_background.png" alt="Omnia Pro Logo" class="logo">
      </div>
      <div class="header-right">
          <div class="bell-container">
            <img src="/assets/images/icons/bell@3x.png" alt="bell Logo" class="bell-icon">
          </div>
          <div class="user-container">
            <img src="/assets/images/icons/user@3x.png" alt="user" class="user-icon">
            <p v-if="user">{{ user.user_metadata?.name || user.user_metadata?.full_name || user.email  }}</p>
          </div>
          <div class="close-sesion-container">
            <img src="/assets/images/icons/exit@3x.png" alt="exit" class="exit-icon">
            <button @click="cerrarSesion">Cerrar sesión</button>
          </div>
      </div>
    </header>

    <header class="header2">
      <div class="mh1-container" @click="toggleMenu">
          <img src="/assets/images/icons/MH1@3x.png" alt="MH1" class="mh1-icon" :class="{ 'active': isMenuExpanded }">
      </div>
      <div class="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <div class="busqueda-container">
        <img src="/assets/images/icons/icnBusqueda@3x.png" alt="busqueda" class="busqueda-icon">
      </div>
    </header>
    <!-- Menu izquierdo -->
    <aside class="menu-vertical" :class="{ 'expanded': isMenuExpanded }">
      <ul class="menu-list">
        <li>
          <img src="/assets/images/icons/pieIconW@3x.png" alt="Dashboard" class="menu-icon" >
          <span class="menu-text">Dashboard</span> <!-- Texto del menú -->
        </li>
        <li @mouseenter="mostrarSubmenu('administracion')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/projectIconW@3x.png" alt="Administracion" class="menu-icon" >
          <span class="menu-text">Administración</span>

          <!-- Submenú para "Administracion" -->
          <ul v-if="submenuVisible === 'administracion'" class="submenu">
            <li>Empresas</li>
            <li>Unidades organizacionales</li>
            <li>Reglas fonde de ahorro</li>
          </ul>
        </li>
        <li>
          <img src="/assets/images/icons/personaIconW@3x.png" alt="Participantes" class="menu-icon" >
          <span class="menu-text">Participantes</span>
        </li>
        <li @mouseenter="mostrarSubmenu('operaciones')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/opsIconW@3x.png" alt="Operaciones" class="menu-icon" >
          <span class="menu-text">Operaciones</span>
          <!-- Submenú para "Operaciones" -->
          <ul v-if="submenuVisible === 'operaciones'" class="submenu">
            <li>Aportaciones</li>
            <li>Retiros</li>
          </ul>
        </li>
        <li @mouseenter="mostrarSubmenu('aportaciones')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/aportacionesIconW@3x.png" alt="Aportaciones" class="menu-icon" >
          <span class="menu-text">Aportaciones</span>
          <!-- Submenú para "Aportaciones" -->
          <ul v-if="submenuVisible === 'aportaciones'" class="submenu">
            <li>Item1</li>
            <li>Item2</li>
          </ul>
        </li>
        <li @mouseenter="mostrarSubmenu('retiros')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/retirosIconW@3x.png" alt="Retiros" class="menu-icon" >
          <span class="menu-text">Retiros</span>
          <!-- Submenú para "Aportaciones" -->
          <ul v-if="submenuVisible === 'retiros'" class="submenu">
            <li>Item1</li>
            <li>Item2</li>
          </ul>
        </li>
        <li @mouseenter="mostrarSubmenu('prestamos')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/loansIconW@3x.png" alt="Prestamos" class="menu-icon" >
          <span class="menu-text">Préstamos</span>
          <!-- Submenú para "Prestamos" -->
          <ul v-if="submenuVisible === 'prestamos'" class="submenu">
            <li>Item1</li>
            <li>Item2</li>
          </ul>
        </li>
        <li @mouseenter="mostrarSubmenu('documentos')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/docsIconW@3x.png" alt="Documentos" class="menu-icon" >
          <span class="menu-text">Documentos</span>
          <!-- Submenú para "Documentos" -->
          <ul v-if="submenuVisible === 'documentos'" class="submenu">
            <li>Item1</li>
            <li>Item2</li>
          </ul>
        </li>
        <li @mouseenter="mostrarSubmenu('comunicados')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/comsIconW@3x.png" alt="Comunicados" class="menu-icon" >
          <span class="menu-text">Comunicados</span>
          <!-- Submenú para "Comunicados" -->
          <ul v-if="submenuVisible === 'comunicados'" class="submenu">
            <li>Item1</li>
            <li>Item2</li>
          </ul>
        </li>
        <li @mouseenter="mostrarSubmenu('ayuda')" @mouseleave="ocultarSubmenu">
          <img src="/assets/images/icons/ayudaIconW@3x.png" alt="Ayuda" class="menu-icon" >
          <span class="menu-text">Ayuda</span>
          <!-- Submenú para "Ayuda" -->
          <ul v-if="submenuVisible === 'ayuda'" class="submenu">
            <li>Item1</li>
            <li>Item2</li>
          </ul>
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

// Estado para controlar si el menú está expandido
const isMenuExpanded = ref(false);

// Función para alternar el estado del menú
const toggleMenu = () => {
  isMenuExpanded.value = !isMenuExpanded.value;
};

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
  padding: 0px;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  background-color: #834f99;
  border-bottom: 0px solid #ddd;
  width: 100%;
  overflow: hidden;
  padding: 20px 0px;
}

.bell-icon {
  width: 30px; /* Ajusta el tamaño del ícono */
  height: 30px; /* Ajusta el tamaño del ícono */
}

.user-icon {
  width: 30px; /* Ajusta el tamaño del ícono */
  height: 30px; /* Ajusta el tamaño del ícono */
}

.exit-icon {
  width: 30px; /* Ajusta el tamaño del ícono */
  height: 30px; /* Ajusta el tamaño del ícono */
}

.header2 {
  display: flex;
  align-items: center;
  background-color: #1a1026;
  border-bottom: 0px solid #ddd;
  padding: 10px 0px;
  font-size: 0;
}

.mh1-container {
  margin-left: 20px;
}

.mh1-icon {
  width: 30px; /* Ajusta el tamaño del ícono */
  height: 30px; /* Ajusta el tamaño del ícono */
}

.app-name {
  font-size: 24px;
  font-weight: bold;
}

.search-bar {
  margin-left: 20px;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  background-color: #333333;
  /*text-align: left;*/
}

.busqueda-container {
  margin-left: 10px;
}

.busqueda-icon {
  width: 30px; /* Ajusta el tamaño del ícono */
  height: 30px; /* Ajusta el tamaño del ícono */
}

.user-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.user-container p {
  white-space: nowrap; /* Evita que el texto salte a una nueva línea */
}

.close-sesion-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-sesion-container button {
  padding: 8px 12px;
  background-color: #834f99;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.close-sesion-container button:hover {
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
  display: flex;
  justify-content: flex-start; /* Alinea el logo a la izquierda */
  align-items: center; /* Centra verticalmente el logo */
  margin-left: 35px;
  max-width: 30%;
  height: 100%;
}

.logo {
  max-width: 50%;
  height: auto;
}

.header-right {
  display: flex;
  justify-content: flex-start; /* Alinea el logo a la izquierda */
  align-items: center;
  gap: 80px; /* Espacio entre los elementos de la derecha */
  margin-left: auto; /* Empuja los elementos hacia la derecha */
  padding: 0px 10px;
}

.menu-vertical {
  width: 50px; /* Ancho del menú */
  background-color: #1a1026; /* Color de fondo del menú */
  color: white; /* Color del texto */
  padding: 0px;
  border-radius: 15px; /* Esquinas redondeadas */
  margin: 5px 0px 0px 10px; /* Margen para separar el menú del borde */
  transition: width 0.3s ease;
  height: 100%; /* Ocupa toda la altura disponible */
}

.menu-list {
  margin-top: 0px; /* Espacio en la parte superior de la lista */
  list-style: none; /* Quita los puntos de la lista */
  padding-left: 0; /* Elimina el padding izquierdo por defecto */
  margin: 0; /* Elimina el margen por defecto */
}

.menu-list li:first-child {
  margin-top: 10px; /* Espacio solo para el primer ícono */
}

.menu-vertical:hover {
  width: 200px; /* Ancho expandido del menú (íconos + texto) */
}

.menu-vertical ul {
  list-style: none; /* Quita los puntos de la lista */
  padding: 0;
  margin: 0;
}

.menu-vertical li {
  display: flex;
  align-items: center;
  gap: 24px; /* Espacio entre el ícono y el texto */
  padding: 5px 17px; /* Espacio vertical entre los iconos y espacio horizontal */
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative; 
}

.menu-vertical li:hover {
  background-color: transparent; /* Color de fondo al pasar el mouse */
}

.menu-vertical li:hover .menu-icon {
  filter: brightness(0.7); /* Cambia el color del ícono a gris */
}

.menu-vertical li:hover .menu-text {
  color: gray; /* Cambia el color del texto a gris */
}

.menu-text {
  opacity: 0; /* Oculta el texto por defecto */
  transition: opacity 0.3s ease; /* Transición suave para la opacidad */
}

.menu-vertical:hover .menu-text {
  opacity: 1; /* Muestra el texto al pasar el mouse */
}

.menu-icon {
  width: 15px; /* Ajusta el tamaño del ícono */
  height: 15px; /* Ajusta el tamaño del ícono */
}

.submenu {
  position: absolute;
  left: calc(100% + 5px); /* Posiciona el submenú a la derecha del menú principal */
  top: 0;
  width: 200px; /* Ancho del submenú */
  background-color: #1a1026; /* Color de fondo del submenú */
  border-radius: 8px; /* Esquinas redondeadas */
  padding: 5px 17px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra para el submenú */
  z-index: 10;
}

.submenu li {
  padding: 8px;
  border-radius: 4px;
  text-align: left;
}

.submenu li:hover {
  background-color: transparent; /* Color de fondo al pasar el mouse */
  color: gray; /* Cambia el color del texto a gris */
}

/* Espacio invisible entre el menú y el submenú */
.submenu::before {
  content: "";
  position: absolute;
  left: -5px; /* Espacio entre el menú y el submenú */
  top: 0;
  width: 5px; /* Ancho del espacio invisible */
  height: 100%;
}

.mh1-icon.active {
  filter: brightness(0.7); /* Cambia el color del ícono a gris */
}

/* Estilos para el menú vertical cuando está expandido */
.menu-vertical.expanded {
  width: 200px; /* Ancho expandido del menú */
}

.menu-vertical.expanded .menu-text {
  opacity: 1; /* Muestra el texto cuando el menú está expandido */
}
</style>
