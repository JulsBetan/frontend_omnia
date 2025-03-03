<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/supabase/client';

// Instancias de Vue Router
const router = useRouter();
const route = useRoute();

// Variables reactivas
const unitId = ref<number | null>(null);
const unitName = ref('');
const location = ref('');
const code = ref('');
const errorMessage = ref('');

// Cargar datos de la unidad
onMounted(async () => {
  unitId.value = Number(route.params.id);
  
  const { data, error: fetchError } = await supabase
    .from('units')
    .select('*')
    .eq('id', unitId.value)
    .single();

  if (fetchError) {
    errorMessage.value = 'Error al cargar la unidad';
    console.error(fetchError);
  } else {
    unitName.value = data.unit_name;
    location.value = data.location;
    code.value = data.code;
  }
});

// Actualizar la unidad
const updateUnit = async () => {
  if (!unitName.value || !location.value || !code.value) {
    errorMessage.value = 'Todos los campos son obligatorios';
    return;
  }

  const { error: updateError } = await supabase
    .from('units')
    .update({
      unit_name: unitName.value,
      location: location.value,
      code: code.value,
    })
    .eq('id', unitId.value);

  if (updateError) {
    errorMessage.value = 'Error al actualizar la unidad';
    console.error(updateError);
  } else {
    router.push('/inicio/unidades');
  }
};

// Eliminar la unidad
const deleteUnit = async () => {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta unidad?');
  if (!confirmDelete) return;

  const { error: deleteError } = await supabase
    .from('units')
    .delete()
    .eq('id', unitId.value);

  if (deleteError) {
    errorMessage.value = 'Error al eliminar la unidad';
    console.error(deleteError);
  } else {
    router.push('/inicio/unidades');
  }
};

// Volver a la lista de unidades
const goBack = () => {
  router.push('/inicio/unidades');
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
      <h2 class="title">Editar Unidad Organizacional</h2>
    </div>
    <div class="form-container">
      <div class="form-row">
        <div class="input-group">
          <label>Unidad Organizacional</label>
          <input v-model="unitName" type="text" placeholder="Capture Unidad Organizacional..."/>
        </div>
        <div class="input-group">
          <label>Ubicación</label>
          <input v-model="location" type="text" placeholder="Capture Ubicación..."/>
        </div>
        <div class="input-group">
          <label>Código</label>
          <input v-model="code" type="text" placeholder="Capture Código..."/>
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="button-group">
        <button @click="goBack" class="cancel-button">Cancelar</button>
        <button @click="updateUnit" class="save-button">
          <img 
            src="/assets/images/icons/saveIconW@3x.png" 
            alt="Guardar" 
            class="save-icon"
          />
          Guardar
        </button>
        <button @click="deleteUnit" class="delete-button">
          <img 
            src="/assets/images/icons/deleteIcon@3x.png" 
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
