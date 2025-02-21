<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/supabase/client';

// Instancias de Vue Router
const router = useRouter();
const route = useRoute();

// Variables reactivas
const companyId = ref<number | null>(null);
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

// Cargar datos de la empresa
onMounted(async () => {
  companyId.value = Number(route.params.id);
  
  const { data, error: fetchError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId.value)
    .single();

  if (fetchError) {
    errorMessage.value = 'Error al cargar la empresa';
    console.error(fetchError);
  } else {
    businessName.value = data.business_name;
    industry.value = data.industry;
    sector.value = data.sector;
    code.value = data.code;
  }
});

// Actualizar la empresa
const updateCompany = async () => {
  if (!businessName.value || !industry.value || !sector.value || !code.value) {
    errorMessage.value = 'Todos los campos son obligatorios';
    return;
  }

  const { error: updateError } = await supabase
    .from('companies')
    .update({
      business_name: businessName.value,
      industry: industry.value,
      sector: sector.value,
      code: code.value,
    })
    .eq('id', companyId.value);

  if (updateError) {
    errorMessage.value = 'Error al actualizar la empresa';
    console.error(updateError);
  } else {
    router.push('/inicio/empresas');
  }
};

// Eliminar la empresa
const deleteCompany = async () => {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta empresa?');
  if (!confirmDelete) return;

  const { error: deleteError } = await supabase
    .from('companies')
    .delete()
    .eq('id', companyId.value);

  if (deleteError) {
    errorMessage.value = 'Error al eliminar la empresa';
    console.error(deleteError);
  } else {
    router.push('/inicio/empresas');
  }
};

// Volver a la lista de empresas
const goBack = () => {
  router.push('/inicio/empresas');
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
      <h2 class="title">Editar Empresa</h2>
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
        <button @click="goBack" class="cancel-button">Cancelar</button>
        <button @click="updateCompany" class="save-button">
          <img 
            src="/assets/images/icons/saveIconW@3x.png" 
            alt="Guardar" 
            class="save-icon"
          />
          Guardar
        </button>
        <button @click="deleteCompany" class="delete-button">
          <img 
            src="/assets/images/icons/deleteIcon@3x.png" 
            alt="Eliminar" 
            class="delete-icon"
          />
          Eliminar
        </button>
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
  color: black;
}

input, select {
  padding: 8px;
  border: 1px solid #834f99;
  border-radius: 8px;
  font-size: 1rem;
  color: #000;
  background-color: transparent;
  outline: none;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.button-group {
  margin-top: 100px;
  display: flex;
  align-items: center;
  justify-content: center; /* Centra los botones horizontalmente */
  gap: 20px; /* Espacio horizontal entre los botones */
}

.cancel-button {
  background-color: transparent;
  color: #834f99;
  border: 1px solid #834f99;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  width: 140px;
}

.cancel-button:hover {
  background-color: #834f99;
  color: white;
}

.save-icon, .delete-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.save-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: #834f99;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  width: 140px;
  gap: 10px;
}

.save-button:hover {
  background-color: #6b3d7f;
}

.delete-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: red;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  width: 140px;
  gap: 10px;
}

.delete-button:hover {
  background-color: darkred;
}
</style>
