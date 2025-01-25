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
@import "@/assets/styles/auth.css"
</style>
