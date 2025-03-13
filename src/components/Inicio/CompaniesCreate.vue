<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/supabase/client';
import { useRouter } from 'vue-router';

const router = useRouter();

// Datos de la nueva empresa
const businessName = ref('');
const industry = ref('');
const sector = ref('');
const code = ref('');
const errorMessage = ref('');

const industries = [
  'Educación', 'Negocio', 'Gobierno - Estatal y local', 'Gobierno - Federal',
  'Organización sin fines de lucro', 'Trabajador autónomo', 'Pequeña o mediana empresa', 'Start-Up'
];

const sectors = [
  'Aeroespacial', 'Agricultura', 'Automotriz', 'Informática y electrónica', 'Bienes de consumo', 'Educación'
];

// Función para guardar la empresa en Supabase
const saveCompany = async () => {
  if (!businessName.value || !industry.value || !sector.value || !code.value) {
    errorMessage.value = 'Todos los campos son obligatorios';
    return;
  }

  const { error } = await supabase.from('companies').insert([
    {
      business_name: businessName.value,
      industry: industry.value,
      sector: sector.value,
      code: code.value
    }
  ]);

  if (error) {
    errorMessage.value = 'Error al guardar la empresa';
    console.error(error);
  } else {
    router.push('/inicio/empresas'); // Redirigir a la lista de empresas
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
      <h2 class="title">Nueva Empresa</h2>
    </div>
    <div class="form-container">
      <div class="form-row">
        <div class="input-group">
          <label>Razón Social</label>
          <input v-model="businessName" type="text" placeholder="Capture Razón Social..."/>
        </div>
        <div class="input-group">
          <label>Giro</label>
          <select v-model="industry">
            <option value="" disabled>Seleccione una opción</option>
            <option v-for="option in industries" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div class="input-group">
          <label>Sector</label>
          <select v-model="sector">
            <option value="" disabled>Seleccione una opción</option>
            <option v-for="option in sectors" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div class="input-group">
          <label>Código</label>
          <input v-model="code" type="text" />
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="button-group">
        <div class="center-buttons">
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
  </div>
</template>

<style scoped>
@import "@/components/Inicio/Admin.css"
</style>

