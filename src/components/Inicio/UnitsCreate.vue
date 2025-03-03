<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/supabase/client';
import { useRouter } from 'vue-router';

const router = useRouter();

// Datos de la nueva empresa
const unitName = ref('');
const location = ref('');
const code = ref('');
const errorMessage = ref('');

// Función para guardar la empresa en Supabase
const saveCompany = async () => {
  if (!unitName.value || !location.value || !code.value) {
    errorMessage.value = 'Todos los campos son obligatorios';
    return;
  }

  const { error } = await supabase.from('units').insert([
    {
      unit_name: unitName.value,
      location: location.value,
      code: code.value
    }
  ]);

  if (error) {
    errorMessage.value = 'Error al guardar la empresa';
    console.error(error);
  } else {
    router.push('/inicio/unidades'); // Redirigir a la lista de unidades
  }
};

// Función para regresar a la página anterior
const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="main-content-company">
    <div class="title-container">
      <img 
        src="/assets/images/icons/iconBack@3x.png" 
        alt="Volver" 
        class="back-icon"
        @click="goBack"
      />
      <h2 class="title">Nueva Unidad Organizacional</h2>
    </div>
    <div class="form-container">
      <div class="form-row">
        <div class="input-group">
          <label>Unidad Organizacional</label>
          <input v-model="unitName" type="text" placeholder="Capture Unidad Organizacional..."/>
        </div>
        <div class="input-group">
          <label>Ubicación</label>
          <input v-model="location" type="text" placeholder="Capture Ubicación..."/>
        </div>
        <div class="input-group">
          <label>Código</label>
          <input v-model="code" type="text" placeholder="Capture Código..."/>
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="button-group">
        <button @click="goBack" class="cancel-button">Cancelar</button>
        <button @click="saveCompany" class="save-button">
          <img 
            src="/assets/images/icons/saveIconW@3x.png" 
            alt="Guardar" 
            class="save-icon"
          />
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/components/Inicio/Admin.css"
</style>

