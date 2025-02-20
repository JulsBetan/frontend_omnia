<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter();

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

// Función para ir a la página anterior
const goBack = () => {
  window.history.back();
};

// Función para manejar la búsqueda
const handleSearch = () => {
  console.log('Búsqueda:', searchQuery.value);
  // Aquí puedes implementar la lógica de búsqueda
};

// Función para manejar el botón "Nuevo"
const handleNew = () => {
  console.log('Nuevo');
  router.push('/inicio/empresas/alta');
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
          <img 
            src="/assets/images/icons/iconAdd@3x.png" 
            alt="Agregar" 
            class="add-icon"
          />
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
  display: flex;
  align-items: center;
  width: 93%;
  margin-bottom: 0px; 
}

.back-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  margin-right: 0px;
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
  flex-grow: 1; /* Hace que el título ocupe el espacio restante */
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
}

/* Contenedor "actions" */
.actions-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* Campo de búsqueda */
.search-input {
  width: 500px;
  padding: 8px 12px 8px 40px;
  border: 1px solid #834f99;
  border-radius: 8px;
  font-size: 1rem;
  color: #000;
  background-color: transparent;
  background-image: url('/assets/images/icons/icnBusqueda@3x.png'); /* Ícono de búsqueda */
  background-size: 20px 20px; /* Tamaño del ícono */
  background-position: 10px center; /* Posición del ícono */
  background-repeat: no-repeat; /* Evita que el ícono se repita */
  outline: none;
}

/* Botón Buscar */
.search-button {
  padding: 8px 16px;
  border: 1px solid #834f99;
  border-radius: 20px;
  background-color: transparent;
  color: #834f99;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 20px;
}

.search-button:hover {
  background-color: #834f99;
  color: white;
}

/* Botón Nuevo */
.new-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: #834f99;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  width: 120px;
  margin-left: auto;
}

.add-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
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
  height: 38px;
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
