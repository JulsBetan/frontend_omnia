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

const iconToggleMap: Record<string, string> = {
  "open": `${baseURL}assets/images/icons/arrOpen@3x.png`,
  "close": `${baseURL}assets/images/icons/arrClose@3x.png`
};

// Estado para seleccionar el tipo de plan
const selectedPlan = ref('Fondo de ahorro');

// Datos del formulario
const businessName = ref('');
const liquidation = ref('');
const uploadedFiles = ref(["reglamento del fondo de ahorro.docx", "EstatutosFA.pdf"]);
const errorMessage = ref('');
const expandedSections = ref<string[]>([]);

const industry = ref('');
const sector = ref('');
const code = ref('');

const salaryPercentage = ref(0);
const matchEmployerContribution = ref(false);
const limitedToUMA = ref(false);
const employerContributionLabel = ref("Empresa");
const employeeContributionLabel = ref("Empleado");
const payrollTypes = ref("Semanal");
const payrollOptions = ["Semanal", "Catorcenal", "Quincenal", "Mensual"];

const allowMidYearLoans = ref(false);
const limitLoanAmount = ref(false);
const loanPercentage = ref(0);
const enableLoanSchedule = ref(false);
const startDate = ref('');
const endDate = ref('');

const includeAccumulatedReturns = ref(false);
const cutOffDate = ref('');
const liquidationDate = ref('');

const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
};

const toggleSection = (section: string) => {
  if (expandedSections.value.includes(section)) {
    expandedSections.value = expandedSections.value.filter(s => s !== section);
  } else {
    expandedSections.value.push(section);
  }
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
        <!-- Formulario para Fondo de ahorro-->
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
              <img src="/assets/images/icons/upload-grey@3x.png" alt="Upload" class="upload-icon"/>
              <button class="explore-button" @click="openFileExplorer">Explorar</button>
              <p class="drag-text">Arrastra y suelta un archivo aquí</p>
              <p class="file-format-text">Documento Word o PDF</p>
              <input ref="fileInput" type="file" @change="handleFileUpload" hidden />
            </div>
          </div>
          <div class="uploaded-files">
            <label>Estatutos o reglamentos cargados:</label>
            <ul>
              <li v-for="(file, index) in uploadedFiles" :key="index">
                {{ file }}
                <img src="/assets/images/icons/delete-grey@3x.png" alt="Delete" class="delete-icon" @click="deleteFile(index)"/>
              </li>
            </ul>
          </div>
        </div>

        <div class="rules-section">
          <!-- Reglas del plan-->
          <div v-for="section in ['Contribuciones', 'Préstamos', 'Liquidación']" :key="section" class="collapsible">
            <div class="collapsible-header" :class="{ active: expandedSections.includes(section) }" @click="toggleSection(section)">
              <span>{{ section }}</span>
              <img :src="expandedSections.includes(section) ? iconToggleMap['close'] : iconToggleMap['open']" class="toggle-icon"/>
            </div>
            <div v-if="expandedSections.includes(section)" class="collapsible-content">
              <template v-if="section === 'Contribuciones'">
                <div class="form-group">
                  <input v-model="salaryPercentage" type="number" min="0" max="13.00" step="0.5" class="input-small" />
                  <label>% Salario del colaborador</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" v-model="matchEmployerContribution" />
                  <label>Match aportación empresa</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" v-model="limitedToUMA" />
                  <label>Limitado a 1.3 UMAs</label>
                </div>
                <div class="form-group-column">
                  <label>Aportación del patrón:</label>
                  <input v-model="employerContributionLabel" type="text" class="input-medium" />
                </div>
                <div class="form-group-column">
                  <label>Aportación del colaborador:</label>
                  <input v-model="employeeContributionLabel" type="text" class="input-medium" />
                </div>
                <div class="form-group-column">
                  <label>Tipos de nómina que participan en este plan:</label>
                  <select v-model="payrollTypes" class="input-medium">
                    <option v-for="option in payrollOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </template>
              <template v-if="section === 'Préstamos'">
                <div class="form-group">
                  <input type="checkbox" v-model="allowMidYearLoans" />
                  <label>Permitir préstamos a mitad del ejercicio</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" v-model="limitLoanAmount" />
                  <label>Límitar importe máximo del préstamo:</label>
                  <input v-if="limitLoanAmount" v-model="loanPercentage" type="number" min="0" max="100" step="0.5" class="input-small" />
                  <label v-if="limitLoanAmount">% del saldo acumulado</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" v-model="enableLoanSchedule" />
                  <label>Calendario para recibir solicitudes</label>
                </div>
                <div class="form-group" v-if="enableLoanSchedule">
                  <label>Del:</label>
                  <input v-model="startDate" type="date" class="input-medium" />
                  <label>Al:</label>
                  <input v-model="endDate" type="date" class="input-medium" />
                </div>
              </template>
              <template v-if="section === 'Liquidación'">
                <div class="form-group-column">
                  <label>Renuncias o bajas durante el ejercicio</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" v-model="includeAccumulatedReturns" />
                  <label>Incluir rendimientos acumulados</label>
                </div>
                <div class="form-group-column">
                  <label>Liquidación del ejercicio</label>
                </div>
                <div class="form-group">
                  <label>Fecha de corte de rendimientos:</label>
                  <input v-model="cutOffDate" type="date" class="input-medium" />
                </div>
                <div class="form-group">
                  <label>Fecha de liquidación:</label>
                  <input v-model="liquidationDate" type="date" class="input-medium" />
                </div>
              </template>
            </div>
          </div>
        </div>

      </div> 

      <div v-if="selectedPlan === 'Caja de ahorro'">
        <!-- Formulario para Caja de ahorro-->
        <div class="form-row">
          <div class="input-group">
            <label>Razón Social</label>
            <input v-model="businessName" type="text" placeholder="Capture Razón Social..."/>
          </div>
        </div>
      </div>

      <div v-if="selectedPlan === 'Fondo de pensiones'">
        <!-- Formulario para Fondo de pensiones-->
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

.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.form-group-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}
.input-small {
  width: 100px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.input-medium {
  width: 150px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.tab-panel {
  display: flex;
  justify-content: center;
  gap: 200px;
  margin: 10px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2); /* Transparente */
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
  margin: 0;
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
  display: flex;             /* Activa flexbox */
  flex-direction: column;    /* Asegura que los elementos estén en columna */
  align-items: center;       /* Centra horizontalmente */
  justify-content: center;   /* Centra verticalmente */
  text-align: center;        /* Asegura que el texto también esté centrado */
  border: 2px dashed #ccc;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  min-height: 100px;         /* Ajusta según necesidad */
  gap: 10px;
}
.upload-icon {
  width: 30px;
}
.drag-text {
  color: grey;
}
.file-format-text {
  color: black;
}
.drag-text,
.file-format-text {
  margin: 0;                 /* Evita espacios extra */
  display: block;            /* Asegura que ocupen toda la línea */
  text-align: center;        /* Centra el texto */
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
  height: 16px;
}

</style>
