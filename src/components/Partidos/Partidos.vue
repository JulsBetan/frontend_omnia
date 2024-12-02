<template>
  <div class="partidos-container">
    <div class="left-panel">
      <img src="/assets/images/balon2.png" alt="logo" />
    </div>
    <div class="right-panel">
      <div class="top-bar">Liga Espanola</div>
      <div class="content">
        <h2>Próximos Partidos</h2>
        <ul>
          <li v-for="(partido, index) in partidos" :key="index">
            {{ partido.fecha }}: {{ partido.local }} vs {{ partido.visitante }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "Partidos",
  setup() {
    const partidos = ref<
      { fecha: string; local: string; visitante: string }[]
    >([]);

    onMounted(() => {
      partidos.value = [
        { fecha: "2014-12-29", local: "Liverpool", visitante: "Swansea" },
        { fecha: "2014-12-29", local: "Arsenal", visitante: "Chelsea" },
        { fecha: "2014-12-30", local: "Manchester City", visitante: "Everton" },
        { fecha: "2014-12-31", local: "Tottenham", visitante: "Leicester" },
      ];
    });

    return { partidos };
  },
});
</script>

<style scoped>
/* Estilos del componente */
.partidos-container {
  display: flex;
  height: 100%;
}

.left-panel {
  width: 20%;
  background: linear-gradient(to right, #1cb5e0, #000046);
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-panel img {
  width: 80%;
}

.right-panel {
  width: 80%;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background: #222291;
  color: white;
  padding: 10px;
  text-align: center;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f4f4f4;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  margin: 10px 0;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

ul li {
  color: blue; /* Cambia el texto de la lista a blanco */
  font-size: 16px; /* Ajusta el tamaño */
  font-weight: bold; /* Resalta el texto */
  padding: 10px;
  margin: 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

h2 {
  color: blue; /* Cambia el color del título a blanco */
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center; /* Centra el título */
}
</style>
