<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase/client';

interface Unit {
  id: number;
  unit_name: string;
  location: string;
  code: string;
}

const units = ref<Unit[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');

const router = useRouter();

// Paginación
const itemsPerPage = 5;
const currentPage = ref(1);

const fetchUnits = async () => {
  loading.value = true;
  error.value = null;
  
  const { data, error: fetchError } = await supabase
    .from('units')
    .select('*');

  if (fetchError) {
    error.value = 'Error al cargar los datos';
    console.error(fetchError);
  } else {
    units.value = data;
  }

  loading.value = false;
};

onMounted(fetchUnits);

const filteredUnits = computed(() => {
  if (!searchQuery.value) {
    return units.value;
  }
  const query = searchQuery.value.toLowerCase();
  return units.value.filter(unit =>
    unit.unit_name.toLowerCase().includes(query)
  );
});

const paginatedUnits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUnits.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredUnits.value.length / itemsPerPage));

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
  router.push('/inicio/unidades/alta');
};

// Redirigir a la página de actualización de una empresa
const navigateToUpdate = (companyId: number) => {
  router.push(`/inicio/unidades/editar/${companyId}`);
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
      <h2 class="title">Consulta Unidades Organizacionales</h2>
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
            <th>Nombre Unidad Organizacional</th>
            <th>Ubicación</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(unit, index) in paginatedUnits" :key="unit.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray'">
            <td>
                <a class="element-link" @click="navigateToUpdate(unit.id)">
                  {{ unit.unit_name }}
                </a>
            </td>
            <td>{{ unit.location }}</td>
            <td>{{ unit.code }}</td>
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
@import "@/components/Inicio/Admin_consultas.css"
</style>
