<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase/client';

interface Plan {
  id: string;
  plan_name: string;
  plan_type: string | null;
  settlement_type: string | null;
  last_modified: string;
}

const plans = ref<Plan[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');

const router = useRouter();

// Paginación
const itemsPerPage = 5;
const currentPage = ref(1);

// Obtener los planes desde Supabase
const fetchPlans = async () => {
  loading.value = true;
  error.value = null;

  const { data, error: fetchError } = await supabase
    .from('plans')
    .select('id, plan_name, plan_type, settlement_type, last_modified');

  if (fetchError) {
    error.value = 'Error al cargar los datos';
    console.error(fetchError);
  } else {
    plans.value = data;
  }

  loading.value = false;
};

onMounted(fetchPlans);

// Filtrado de planes por búsqueda
const filteredPlans = computed(() => {
  if (!searchQuery.value) {
    return plans.value;
  }
  const query = searchQuery.value.toLowerCase();
  return plans.value.filter(plan =>
    plan.plan_name.toLowerCase().includes(query)
  );
});

// Paginación de los planes
const paginatedPlans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPlans.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredPlans.value.length / itemsPerPage));

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
};

// Función para manejar el botón "Nuevo"
const handleNew = () => {
  console.log('Nuevo');
  router.push('/inicio/reglas/alta');
};

// Redirigir a la página de actualización de un plan
const navigateToUpdate = (planId: string) => {
  router.push(`/inicio/planes/editar/${planId}`);
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
      <h2 class="title">Consulta Planes</h2>
    </div>
    <div class="table-container">
      <!-- Contenedor "actions" -->
      <div class="actions-container">
        <!-- Campo de búsqueda -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar plan..."
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
            <th>Nombre del Plan</th>
            <th>Tipo de Plan</th>
            <th>Liquidación</th>
            <th>Última Modificación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(plan, index) in paginatedPlans" :key="plan.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray'">
            <td>
                <a class="element-link" @click="navigateToUpdate(plan.id)">
                  {{ plan.plan_name }}
                </a>
            </td>
            <td>{{ plan.plan_type || 'No especificado' }}</td>
            <td>{{ plan.settlement_type || 'No especificado' }}</td>
            <td>{{ new Date(plan.last_modified).toLocaleDateString('es-MX') }}</td>
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
