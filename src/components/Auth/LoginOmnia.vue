<template>
  <div class="login-container">
    <div class="column column-left">
      <div class="logo-container">
        <img src="/assets/images/omniapro_color_logo_no_background.png" alt="Omnia Pro Logo" class="logo">
      </div>
    </div>
    <div class="column column-center"></div>
    <div class="column column-right">
      <div class="login-form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="header">
            <h2 class="login-title">Inicio de sesión</h2>
          </div>
          <div class="form-group">
            <label for="email">Usuario:</label>
            <input id="email" type="text" v-model="email" placeholder="Escribe el usuario o correo electrónico" class="form-control">
          </div>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input id="password" type="password" v-model="password" placeholder="Contraseña" class="form-control">
          </div>
          <button type="submit" class="login-button">Ingresar</button>
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
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");

    const formValid = computed(() => email.value.trim() !== "" && password.value.trim() !== "");

    const handleLogin = async () => {
      // Implementación de login
    };

    const loginWithGoogle = () => {
      // Implementación de login con Google
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

    return { email, password, formValid, handleLogin, loginWithGoogle, loginWithMicrosoft, redirectToSignup, recoverPassword };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  background-color: white; /* Fondo blanco para toda la pantalla */
  background-image: url("/assets/images/america.png"); /* Imagen de fondo */
  background-position: top;
  background-size: 50%;
  background-repeat: no-repeat;
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
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.login-form-container {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #6200EE;
  color: white;
  text-align: center;
  padding: 0px 0; /* Añadir padding para que el texto no esté pegado al borde */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%; /* Asegurarse de que el ancho sea 100% */
  margin: 0; /* Eliminar márgenes */
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
  background-color: #6200EE;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.login-button:hover {
  background-color: #5000b0;
}

.social-login button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.google-login {
  background-color: #DB4437;
  color: white;
}

.microsoft-login {
  background-color: #0078D4;
  color: white;
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
