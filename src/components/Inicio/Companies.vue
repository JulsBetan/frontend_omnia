<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

// Paginación
const itemsPerPage = 5;
const currentPage = ref(1);

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

const filteredCompanies = computed(() => {
  if (!searchQuery.value) {
    return companies.value;
  }
  const query = searchQuery.value.toLowerCase();
  return companies.value.filter(company =>
    company.business_name.toLowerCase().includes(query)
  );
});

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCompanies.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / itemsPerPage));

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

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

// Redirigir a la página de actualización de una empresa
const navigateToUpdate = (companyId: number) => {
  router.push(`/inicio/empresas/editar/${companyId}`);
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
          <tr v-for="(company, index) in paginatedCompanies" :key="company.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray'">
            <td>
                <a class="company-link" @click="navigateToUpdate(company.id)">
                  {{ company.business_name }}
                </a>
            </td>
            <td>{{ company.industry }}</td>
            <td>{{ company.sector }}</td>
            <td>{{ company.code }}</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
      </div>

    </div>
  </div>
</template>

<style scoped>

.company-link {
  color: #834f99;
  text-decoration: underline;
  cursor: pointer;
}

.company-link:hover {
  color: #6b3d7f;
}

.pagination {
  position: absolute;
  bottom: 30px; /* Fija la distancia desde el bottom */
  left: 50%; /* Centra horizontalmente */
  transform: translateX(-50%); /* Asegura el centrado exacto */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.pagination button {
  padding: 8px 12px;
  border: 1px solid #834f99;
  background-color: #834f99;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  color: #ae96b7; /* Cambia este color según lo que necesites */
  font-weight: bold; /* Opcional: hace que el texto sea más visible */
}

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
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  height: 60%;
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
  margin-top: 20px;
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
  margin-top: 30px;
}

/* Encabezado */
thead {
  background-color: #ae96b7;
  color: white;
  font-weight: bold;
}

th {
  padding: 14px 8px;
  text-align: center;
  height: 18px;
}

/* Celdas de la tabla */
td {
  padding: 4px 8px;
  text-align: center;
  color: black; /* Color de texto negro */
  border: 1px solid #d8d8d8;
}

/* Filas alternas */
.bg-gray {
  background-color: #d8d8d8;
}

table {
  font-size: 14px;  /* Reduce el tamaño de la letra */
}

</style>
