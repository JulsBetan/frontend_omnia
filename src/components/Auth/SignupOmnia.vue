<template>
  <div class="login-container">
    <div class="column column-left">
      <div class="logo-container">
        <img src="/assets/images/omniapro_color_logo_no_background.png" alt="Omnia Pro Logo" class="logo">
      </div>
    </div>
    <div class="column column-center"></div>
    <div class="column column-right">
      <div class="title-container">
        <h2 class="app-title">Omnia Pro Corporate</h2>
      </div>
      <div class="login-form-container">
        <div class="header">
          <h2 class="login-title">Registro</h2>
        </div>
        <div class="container">
          <form @submit.prevent="handleSignup" class="login-form">
            <div class="form-group">
              <label for="firstName">Nombre(s):</label>
              <input id="firstName" type="text" v-model="firstName" placeholder="Escribe tu nombre" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="lastName">Apellido Paterno:</label>
              <input id="lastName" type="text" v-model="lastName" placeholder="Escribe tu apellido paterno" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="middleName">Apellido Materno (Opcional):</label>
              <input id="middleName" type="text" v-model="middleName" placeholder="Escribe tu apellido materno" class="form-control">
            </div>
            <div class="form-group phone-group">
              <div class="country-code-container">
                <label for="countryCode">Código de país:</label>
                <select id="countryCode" v-model="countryCode" class="form-control small-select" required>
                  <option value="+52">México (+52)</option>
                  <option value="+1">USA (+1)</option>
                </select>
              </div>
              <div class="phone-number-container">
                <label for="phoneNumber">Número telefónico:</label>
                <input id="phoneNumber" type="text" v-model="phoneNumber" placeholder="Número de teléfono" class="form-control" required>
              </div>
            </div>
            <div class="form-group">
              <label for="email">Correo electrónico:</label>
              <input id="email" type="email" v-model="email" placeholder="Escribe tu correo electrónico" class="form-control" required>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="terms" v-model="acceptTerms" required>
              <label for="terms"> Acepto los <a href="/terminos" target="_blank">Términos y Condiciones</a></label>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="privacy" v-model="acceptPrivacy" required>
              <label for="privacy"> Acepto la <a href="/privacidad" target="_blank">Política de Privacidad</a></label>
            </div>
            <div class="button-group">
              <button type="button" class="cancel-button" @click="handleCancel">Cancelar</button>
              <button type="submit" class="signup-button">Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from '@/supabase/client';
import Swal from "sweetalert2";

export default defineComponent({
  name: "SignupOmnia",
  setup() {
    const router = useRouter();
    const firstName = ref("");
    const lastName = ref("");
    const middleName = ref("");
    const countryCode = ref("+52");
    const phoneNumber = ref("");
    const email = ref("");
    const acceptTerms = ref(false);
    const acceptPrivacy = ref(false);

   const handleSignup = async () => {
      if (!acceptTerms.value || !acceptPrivacy.value) {
        Swal.fire({ icon: "warning", title: "Error", text: "Debes aceptar los términos y la política de privacidad." });
        return;
      }

      // Enviar Magic Link para autenticación
      const { error } = await supabase.auth.signInWithOtp({
        email: email.value,
        options: {
          emailRedirectTo: "http://localhost:5173/login", // Redirige tras confirmación
          data: {
            firstName: firstName.value,
            lastName: lastName.value,
            middleName: middleName.value,
            countryCode: countryCode.value,
            phoneNumber: phoneNumber.value,
          },
        },
      });

      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
      } else {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Revisa tu correo para confirmar tu cuenta.",
        });

        router.push("/login");
      }
    }; 

    const handleCancel = () => {
      router.push("/login");
    };   

    return { firstName, lastName, middleName, countryCode, phoneNumber, email, acceptTerms, acceptPrivacy, handleSignup, handleCancel };

  },
});
</script>

<style scoped>
@import "@/assets/styles/auth.css"

</style>

