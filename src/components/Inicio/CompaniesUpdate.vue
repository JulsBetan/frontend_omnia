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
          <input v-model="code" type="text" placeholder="Capture Código..."/>
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="button-group">
        <div class="center-buttons">
          <button @click="goBack" class="cancel-button">Cancelar</button>
          <button @click="updateCompany" class="save-button">
            <img 
              src="/assets/images/icons/saveIconW@3x.png" 
              alt="Guardar" 
              class="save-icon"
            />
            Guardar
          </button>
        </div>
        <button @click="deleteCompany" class="delete-button">
          <img 
            src="/assets/images/icons/deleteRed@3x.png" 
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
@import "@/components/Inicio/Admin.css"
</style>
