<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/supabase/client';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estado para seleccionar el tipo de plan
const selectedPlan = ref('Fondo de ahorro');

// Función para cambiar el tipo de plan
const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
};

// Datos del formulario
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

// Función para guardar la empresa en Supabase (placeholder)
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
    router.push('/inicio/planes');
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
      <h2 class="title">Alta Plan de ahorro</h2>
    </div>

    <!-- Panel de selección de tipo de plan -->
    <div class="tab-panel">
      <div 
        v-for="(plan, index) in ['Fondo de ahorro', 'Caja de ahorro', 'Fondo de pensiones']" 
        :key="index" 
        :class="['tab-option', { active: selectedPlan === plan }]"
        @click="selectPlan(plan)"
      >
        <img 
          :src="`/omnia/assets/images/icons/${plan === 'Fondo de ahorro' ? 'moneyIcon@3x.png' : plan === 'Caja de ahorro' ? 'savingIcon@3x.png' : 'shieldIcon@3x.png'}`" 
          class="tab-icon"
          alt="Icono"
        />
        <span>{{ plan }}</span>
        <div class="underline" v-if="selectedPlan === plan"></div>
      </div>
    </div>

    <!-- Formulario según la selección -->
    <div class="form-container">
      <div v-if="selectedPlan === 'Fondo de ahorro'">
        <h3>Formulario para Fondo de ahorro</h3>
        <div class="form-row">
          <div class="input-group">
            <label>Razón Social</label>
            <input v-model="businessName" type="text" placeholder="Capture Razón Social..."/>
          </div>
        </div>
      </div>

      <div v-if="selectedPlan === 'Caja de ahorro'">
        <h3>Formulario para Caja de ahorro</h3>
        <div class="form-row">
          <div class="input-group">
            <label>Razón Social</label>
            <input v-model="businessName" type="text" placeholder="Capture Razón Social..."/>
          </div>
        </div>
      </div>

      <div v-if="selectedPlan === 'Fondo de pensiones'">
        <h3>Formulario para Fondo de pensiones</h3>
        <div class="form-row">
          <div class="input-group">
            <label>Razón Social</label>
            <input v-model="businessName" type="text" placeholder="Capture Razón Social..."/>
          </div>
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
@import "@/components/Inicio/Admin.css";

.tab-panel {
  display: flex;
  justify-content: center;
  gap: 100px;
  margin: 20px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2); /* Transparente */
  border-radius: 10px;
}

.tab-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  transition: color 0.3s;
  position: relative;
}

.tab-option.active {
  color: #049dff; /* Color del texto cuando está seleccionado */
}

.underline {
  position: absolute;
  bottom: -5px;
  width: 100%;
  height: 3px;
  background-color: #049dff; /* Línea debajo de la opción seleccionada */
  border-radius: 2px;
}

.tab-option .tab-icon {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.cancel-button, .save-button {
  width: 140px;
}

.cancel-button {
  background-color: transparent;
  color: #834f99;
  border: 1px solid #834f99;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #834f99;
  color: white;
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
}

.save-button:hover {
  background-color: #6b3d7f;
}

.save-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>
