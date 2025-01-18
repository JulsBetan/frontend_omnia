<template>
  <div class="login-container">
    <div class="column column-left">
      <div class="logo-container">
        <img src="/assets/images/omniapro_color_logo_no_background.png" alt="Omnia Pro Logo" class="logo">
      </div>
    </div>
    <div class="column column-center"></div>
    <div class="column column-right">
      <!-- Contenedor para el título -->
      <div class="title-container">
        <h2 class="app-title">Omnia Pro Corporate</h2>
      </div>
      <!-- Contenedor para el formulario -->
      <div class="login-form-container">
        <div class="header">
            <h2 class="login-title">Inicio de sesión</h2>
        </div>

        <div class="container">

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label for="email">Usuario:</label>
                <input id="email" type="text" v-model="email" placeholder="Escribe el usuario o correo electrónico" class="form-control">
              </div>
              <div class="form-group">
                <label for="password">Contraseña:</label>
                <input id="password" type="password" v-model="password" placeholder="Contraseña" class="form-control">
              </div>
              <button type="submit" class="login-button">Ingresar</button>
              <div class="social-login">
                  <button @click.prevent="loginWithSupabase" class="supabase-login">Sign In</button>
              </div>
              <div class="login-footer">
                <a @click.prevent="redirectToSignup" class="link">¿No tienes cuenta? <span>Crear una cuenta</span></a>
                <a @click.prevent="recoverPassword" class="link">¿Olvidaste tu contraseña? <span>Recuperar contraseña</span></a>
              </div>
              <div class="social-login">
                <button @click.prevent="loginWithGoogle" class="google-login">Continuar con Google</button>
                <button @click.prevent="loginWithMicrosoft" class="microsoft-login">Continuar con Microsoft</button>
              </div>
            </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { supabase } from '@/supabase/client';

const URL_DEPORTES = import.meta.env.VITE_API_DEPORTES_URL;

if (!URL_DEPORTES) {
  console.error("VITE_API_DEPORTES_URL no está definida en las variables de entorno.");
}

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();
    const email = ref<string>("");
    const password = ref(<string>"");

    const formValid = computed(() => email.value.trim() !== "" && password.value.trim() !== "");

    const handleLogin = async () => {

      console.log("Boton Ingresar poresionado. Email:", email.value);
      // Implementación de login
      try {
        const response = await axios.post(`${URL_DEPORTES}/users/login`, {
          email: email.value,
          password: password.value,
        });

        if (response.data.access_token) {
          Swal.fire({
            icon: "success",
            title: "Login exitoso",
            text: "Bienvenido!",
            showConfirmButton: false,
            timer: 2000,
          });

          // Guardar el token de acceso en el localStorage o sesión
          localStorage.setItem("access_token", response.data.access_token);

          // Redirigir a la página de partidos
          setTimeout(() => {
            router.push("/partidos");
          }, 2000);
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.detail || "Credenciales incorrectas. Intenta de nuevo.",
          confirmButtonText: "OK",
        });
      }
    };

    const loginWithSupabase = async () => {
      console.log("Boton Sign In poresionado. Email:", email.value);
      // Implementación de Magic Link con Supabase
      if (!email.value) {
        Swal.fire({ icon: "warning", title: "Email requerido", text: "Ingresa tu correo electrónico." });
        return;
      }

      try {
          const { error } = await supabase.auth.signInWithOtp({ email: email.value });

          if (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.message });
          } else {
            Swal.fire({ icon: "success", title: "Revisa tu correo", text: "Te hemos enviado un enlace para iniciar sesión." });
          }
      } catch (error: any) {

        console.error("Error inesperado:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.detail || "Credenciales incorrectas. Intenta de nuevo." || error,
          confirmButtonText: "OK",
        });

      }
    
    };

    const loginWithGoogle = async () => {
      // Implementación de login con Google
      console.log("Intentando iniciar sesión con Google...");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/partidos", // URL a la que redirigir tras el login
          queryParams: { prompt: "select_account"}
        },
      });

      if (error) {
        console.error("Error en autenticación con Google:", error);
        Swal.fire({ icon: "error", title: "Error", text: error.message });
      }
    };

    const loginWithMicrosoft = () => {
      // Implementación de login con Microsoft
    };

    const redirectToSignup = () => {
      router.push("/signup");
    };

    const recoverPassword = () => {
      // Implementación para recuperar contraseña
    };

    return { email, password, formValid, handleLogin, loginWithSupabase, loginWithGoogle, loginWithMicrosoft, redirectToSignup, recoverPassword };
  },
});
</script>

<style scoped>
.app-title {
  text-align: center;
  margin: 0; /* Elimina el margen adicional */
  color: #331c47;
}

.title-container {
  margin-top: 50px;
  width: 100%; /* Asegura que ocupe todo el ancho */
  text-align: center;
  position: absolute;
  top: 20px; /* Ajusta la distancia desde la parte superior */
}

.login-container {
  display: flex;
  min-height: 100vh;
  background-color: white; /* Fondo blanco para toda la pantalla */
  background-image: url("/assets/images/america.png"); /* Imagen de fondo */
  background-position: top;
  background-size: 50%;
  background-repeat: no-repeat;
  overflow-y: auto;
}

.column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.column-left {
  background-color: transparent;
}

.logo-container {
  text-align: center;
}

.logo {
  max-width: 50%;
  height: auto;
}

.column-center {
  background-color: transparent; /* Columna central transparente */
}

.column-right {
  display: flex;
  flex-direction: column; /* Permite organizar elementos verticalmente */
  justify-content: flex-start; /* Alinea al principio */
  align-items: center;
  background-color: transparent;
  padding-top: 50px; /* Ajusta el espacio inicial */
  position: relative;
}

.login-form-container {
  margin-top: 120px; /* Ajusta el espacio del formulario debajo del título */
  width: 90%;
  max-width: 500px;
  padding: 0px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.container {
  padding: 70px;
}

.header {
  background-color: #331c47;
  color: white;
  text-align: center;
  padding: 0px 0; /* Añadir padding para mejorar la apariencia */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  margin: 0;
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}

.login-title {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: black;   
  margin-bottom: 5px;
  text-align: left; 
}

.form-control {
  background-color: white;
  color: black;
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.form-control:focus {
  border-color: #6200EE;
}

.login-button {
  width: 100%;
  background-color: #834f99;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.login-button:hover {
  background-color: #594198;
}

.social-login button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.supabase-login {
  background-color: #834f99;
  color: white;
}

.supabase-login:hover {
  background-color: #594198;
}

.google-login {
  background-color: #834f99;
  color: white;
}

.google-login:hover {
  background-color: #594198;
}

.microsoft-login {
  background-color: #834f99;
  color: white;
}

.microsoft-login:hover {
  background-color: #594198;
}

.link {
  display: block;
  margin-top: 10px;
  text-align: center;
  color: #6200EE;
}

.link span {
  text-decoration: underline;
  cursor: pointer;
}

.link:hover span {
  color: #5000b0;
}
</style>
