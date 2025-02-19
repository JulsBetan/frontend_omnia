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
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Lista de Compañías</h2>
    
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <table v-else class="w-full border-collapse border border-gray-300">
      <thead class="bg-gray-200">
        <tr>
          <th class="border border-gray-300 p-2">Razón Social</th>
          <th class="border border-gray-300 p-2">Giro</th>
          <th class="border border-gray-300 p-2">Sector</th>
          <th class="border border-gray-300 p-2">Código</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in companies" :key="company.id" class="hover:bg-gray-100">
          <td class="border border-gray-300 p-2">{{ company.business_name }}</td>
          <td class="border border-gray-300 p-2">{{ company.industry }}</td>
          <td class="border border-gray-300 p-2">{{ company.sector }}</td>
          <td class="border border-gray-300 p-2">{{ company.code }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th {
  text-align: left;
}
</style>
