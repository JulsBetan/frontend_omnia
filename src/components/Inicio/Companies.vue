<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase/client';

interface Company {
  id: number;
  business_name: string;
  industry: string;
  sector: string;
  code: string;
}

const companies = ref<Company[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');

const fetchCompanies = async () => {
  loading.value = true;
  error.value = null;
  
  const { data, error: fetchError } = await supabase
    .from('companies')
    .select('*');

  if (fetchError) {
    error.value = 'Error al cargar los datos';
    console.error(fetchError);
  } else {
    companies.value = data;
  }

  loading.value = false;
};

onMounted(fetchCompanies);

// Función para manejar la búsqueda
const handleSearch = () => {
  console.log('Búsqueda:', searchQuery.value);
  // Aquí puedes implementar la lógica de búsqueda
};

// Función para manejar el botón "Nuevo"
const handleNew = () => {
  console.log('Nuevo');
  // Aquí puedes implementar la lógica para agregar una nueva empresa
};

</script>

<template>
  <div class="main-content-company">
    <div class="title-container">
      <h2 class="title">Consulta Empresas</h2>
    </div>
    <div class="table-container">
      <!-- Contenedor "actions" -->
      <div class="actions-container">
        <!-- Campo de búsqueda -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar empresa..."
          class="search-input"
        />
        <!-- Botón Buscar -->
        <button @click="handleSearch" class="search-button">
          Buscar
        </button>
        <!-- Botón Nuevo -->
        <button @click="handleNew" class="new-button">
          Nuevo
        </button>
      </div>
      
      <div v-if="loading" class="loading-text">Cargando...</div>
      <div v-else-if="error" class="error-text">{{ error }}</div>
      
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Razón Social</th>
            <th>Giro</th>
            <th>Sector</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(company, index) in companies" :key="company.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray'">
            <td>{{ company.business_name }}</td>
            <td>{{ company.industry }}</td>
            <td>{{ company.sector }}</td>
            <td>{{ company.code }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Asegura que main-content no afecte el header */
.main-content-company {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}

.title-container {
  text-align: center;
}

/* Contenedor con borde redondeado y sombra */
.table-container {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  height: 70%;
  border: 1px solid #d8d8d8;
  margin-top: 0px;
}

/* Estilos del título */
.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  margin-bottom: 16px;
}

/* Contenedor "actions" */
.actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Campo de búsqueda */
.search-input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #834f99;
  border-radius: 8px;
  margin-right: 10px;
  font-size: 1rem;
}

/* Botón Buscar */
.search-button {
  padding: 8px 16px;
  border: 1px solid #834f99;
  border-radius: 8px;
  background-color: transparent;
  color: #834f99;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
}

.search-button:hover {
  background-color: #834f99;
  color: white;
}

/* Botón Nuevo */
.new-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #834f99;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  width: 100px;
}

.new-button:hover {
  background-color: #6b3d7f;
}


/* Mensajes de carga y error */
.loading-text, .error-text {
  text-align: center;
  font-size: 1rem;
  margin: 10px 0;
}

/* Tabla con formato */
.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #d8d8d8;
}

/* Encabezado */
thead {
  background-color: #ae96b7;
  color: white;
  font-weight: bold;
}

th {
  padding: 16px;
  text-align: center;
  height: 48px;
}

/* Celdas de la tabla */
td {
  padding: 12px;
  text-align: center;
  color: black; /* Color de texto negro */
  border: 1px solid #d8d8d8;
}

/* Filas alternas */
.bg-gray {
  background-color: #d8d8d8;
}


</style>
