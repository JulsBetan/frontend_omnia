<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/supabase/client';
import { useRouter } from 'vue-router';

const router = useRouter();

// 🔹 Obtiene automáticamente el `base` definido en `vite.config.ts`
const baseURL = import.meta.env.BASE_URL;

// 🔹 Mapeo de iconos con rutas correctas
const iconMap: Record<string, string> = {
  "Fondo de ahorro": `${baseURL}assets/images/icons/moneyIcon@3x.png`,
  "Caja de ahorro": `${baseURL}assets/images/icons/savingIcon@3x.png`,
  "Fondo de pensiones": `${baseURL}assets/images/icons/shieldIcon@3x.png`
};

// Estado para seleccionar el tipo de plan
const selectedPlan = ref('Fondo de ahorro');

// Datos del formulario
const businessName = ref('');
const liquidation = ref('');
const uploadedFiles = ref(["reglamento del fondo de ahorro.docx", "EstatutosFA.pdf"]);
const errorMessage = ref('');
const expandedSection = ref<string | null>(null);

const industry = ref('');
const sector = ref('');
const code = ref('');

const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
};

const toggleSection = (section: string) => {
  expandedSection.value = expandedSection.value === section ? null : section;
};

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    uploadedFiles.value.push(files[0].name);
  }
};

const deleteFile = (index: number) => {
  uploadedFiles.value.splice(index, 1);
};

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


const fileInput = ref<HTMLInputElement | null>(null);

const openFileExplorer = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
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
        <img :src="iconMap[plan]" class="tab-icon" alt="Icono" />
        <span>{{ plan }}</span>
        <div class="underline" v-if="selectedPlan === plan"></div>
      </div>
    </div>

    <!-- Formulario según la selección -->
    <div class="form-container">
      <div v-if="selectedPlan === 'Fondo de ahorro'">
        <h3>Formulario para Fondo de ahorro</h3>
        <div class="left-section">
          <label>Nombre de plan:</label>
          <input v-model="businessName" type="text" class="input-field" placeholder="Ingrese el nombre del plan..."/>
          <label>Liquidación:</label>
          <input v-model="liquidation" type="text" class="input-field" placeholder="Ingrese liquidación..."/>
        </div>
        <div class="file-upload-section">
          <div class="upload-container">
            <label>Estatus o reglamentos del plan:</label>
            <div class="dropzone">
              <img src="/omnia/assets/images/icons/upload-grey@3x.png" alt="Upload" class="upload-icon"/>
              <p class="drag-text">Arrastra y suelta un archivo aquí</p>
              <p class="file-format-text">Documento Word o PDF</p>
              <input ref="fileInput" type="file" @change="handleFileUpload" hidden />
              <button class="explore-button" @click="openFileExplorer">Explorar</button>
            </div>
          </div>
          <div class="uploaded-files">
            <label>Estatutos o reglamentos cargados:</label>
            <ul>
              <li v-for="(file, index) in uploadedFiles" :key="index">
                {{ file }}
                <img src="/omnia/assets/images/icons/delete-grey@3x.png" alt="Delete" class="delete-icon" @click="deleteFile(index)"/>
              </li>
            </ul>
          </div>
        </div>

        <div class="rules-section">
          <h3>Reglas del plan</h3>
          <div v-for="section in ['Contribuciones', 'Préstamos', 'Liquidación']" :key="section" class="collapsible">
            <div class="collapsible-header" :class="{ active: expandedSection === section }" @click="toggleSection(section)">
              <span>{{ section }}</span>
              <img :src="expandedSection === section ? '/omnia/assets/images/icons/arrClose@3x.png' : '/omnia/assets/images/icons/arrOpen@3x.png'" class="toggle-icon"/>
            </div>
            <div v-if="expandedSection === section" class="collapsible-content">
              <p>Contenido de la sección {{ section }}...</p>
            </div>
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

.left-section {
  width: 50%;
}
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.file-upload-section {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Espacio entre los dos elementos */
  width: 100%;
}
.upload-container, .uploaded-files {
  flex: 1; /* Ambos ocuparán el mismo espacio */
  min-width: 45%; /* Asegura que no se encimen en pantallas pequeñas */
}
.dropzone {
  border: 2px dashed #ccc;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
}
.upload-icon {
  width: 40px;
}
.drag-text {
  color: grey;
}
.file-format-text {
  color: black;
}
.explore-button {
  background-color: transparent;
  color: #834f99;
  border: 1px solid #834f99;
  border-radius: 20px;
  cursor: pointer;
  width: 140px;
  align-items: center;
  padding: 5px 20px;
}

.explore-button:hover {
  background-color: #834f99;
  color: white;
}

.uploaded-files ul {
  list-style: none;
  padding: 0;
}
.uploaded-files li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: grey;
  margin-bottom: 5px;
}
.delete-icon {
  cursor: pointer;
  width: 20px;
}
.rules-section {
  margin-top: 30px;
}
.collapsible {
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.collapsible-header {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background: white;
  color: #834f99;
}
.collapsible-header.active {
  background: #834f99;
  color: white;
}
.collapsible-content {
  padding: 10px;
  background: #f9f9f9;
}
.toggle-icon {
  width: 16px;
}

</style>
