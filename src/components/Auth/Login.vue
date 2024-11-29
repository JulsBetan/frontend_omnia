<template>
  <div class="auth-background">
    <div class="auth-wrapper">
      <div class="modal-dialog" role="document">
        <div class="modal-content p-4">
          <div class="modal-header border-0 mb-2 text-center">
            <img src="/assets/images/balon2.png" width="300px" alt="logo" />
          </div>
          <form @submit.prevent="handleLogin">
            <div class="modal-body">
                <h3 class="mb-4 title">Tus pronosticos de partidos <br>
                  de acuerdo al clima</h3>
              <div class="form-group">
                <input
                  type="text"
                  v-model="email"
                  id="userName"
                  class="form-control"
                  required
                />
                <label class="form-control-placeholder" for="userName">Correo Electrónico</label>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  v-model="password"
                  id="password"
                  class="form-control"
                  required
                />
                <label class="form-control-placeholder" for="password">Password</label>
              </div>
              <label class="tc">
                By signing up I accept the <strong>Terms & Conditions</strong> </label>
            </div>
            <div class="modal-footer border-0 text-center">
              <button
                type="submit"
                class="btn signup btn-block"
                :disabled="!formValid"
              >
                SIGNUP
              </button>
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

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();
    const email = ref<string>("");
    const password = ref<string>("");

    const formValid = computed(() => email.value !== "" && password.value !== "");

    const handleLogin = () => {
      if (email.value === "test@example.com" && password.value === "123456") {
        router.push("/partidos");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    };

    return {
      email,
      password,
      formValid,
      handleLogin,
    };
  },
});
</script>

<style scoped>
/* Fondo exterior (blanco) */
.auth-background {
  background: transparent; /* Fondo blanco */
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Fondo del modal (azul) */
.auth-wrapper {
  background: linear-gradient(to right, #1cb5e0, #000046); /* Azul */
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 600px;
  padding: 20px;
}

/* Contenido del modal */
.modal-content {
  background: transparent; /* Sin fondo adicional, usa el azul del wnsssrapper */
  border: none;
  color: white;
  padding: 0;
}

/* Inputs y placeholders */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-control {
  background: transparent;
  border: none;
  border-bottom: 1px solid grey;
  color: white;
  font-size: 16px;
  padding: 5px 0;
  width: 100%;
}

.form-control:focus {
  border-bottom: 1px solid aqua;
  outline: none;
}

.form-control-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

.form-control:focus + .form-control-placeholder,
.form-control:not(:placeholder-shown) + .form-control-placeholder {
  font-size: 12px;
  transform: translateY(-20px);
}

/* Texto de condiciones */
.tc {
  font-size: 12px;
  color: white;
}

/* Título */
.title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 30px;
}

/* Botón SIGNUP */
.signup {
  background: linear-gradient(to right, #08b0df, #222291); /* Gradiente original */
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  height: 46px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.signup:disabled {
  background: grey;
  cursor: not-allowed;
}
</style>
