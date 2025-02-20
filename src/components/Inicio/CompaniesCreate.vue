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
          <input v-model="businessName" type="text" />
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
        <button @click="goBack" class="cancel-button">Cancelar</button>
        <button @click="saveCompany" class="save-button">Guardar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content-company {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-container {
  display: flex;
  align-items: center;
  width: 93%;
}

.back-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.title {
  flex-grow: 1;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
}

.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
}

.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select {
  padding: 8px;
  border: 1px solid #834f99;
  border-radius: 8px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.cancel-button {
  background-color: transparent;
  color: #834f99;
  border: 1px solid #834f99;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #834f99;
  color: white;
}

.save-button {
  background-color: #834f99;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #6b3d7f;
}
</style>

