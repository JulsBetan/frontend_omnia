<template>
  <div class="partidos-container">
    <div class="left-panel">
      <img src="/assets/images/balon2.png" alt="logo" />
    </div>
    <div class="right-panel">
      <div class="top-bar">
        Próximos Partidos
        <button @click="fetchEventos(true)" class="update-button">Actualizar</button>
      </div>
      <div class="content">
        <ul v-if="eventos.length > 0">
          <li v-for="(partido, index) in eventos" :key="index">
            <router-link 
              :to="{ name: 'DetalleEvento', params: { id: partido.idEvent } }"
              class="evento-link"
            >
              {{ partido.dateEvent }}: {{ partido.strHomeTeam }} vs {{ partido.strAwayTeam }}
            </router-link>
          </li>
        </ul>
        <p v-else>Cargando partidos...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "Partidos",
  setup() {
    const eventos = ref<any[]>([]);

    const fetchEventos = async (forceUpdate = false) => {
      try {
        if (!forceUpdate) {
          const cachedEventos = localStorage.getItem("eventos");
          if (cachedEventos) {
            console.log("Usando eventos de localStorage");
            eventos.value = JSON.parse(cachedEventos);
            return;
          }
        }

        console.log("Solicitando eventos desde la API...");
        const response = await axios.get("http://localhost:8000/events/next");
        eventos.value = response.data;

        // Guardar en localStorage
        localStorage.setItem("eventos", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    onMounted(() => {
      fetchEventos();
    });

    return { eventos, fetchEventos };
  },
});
</script>

<style scoped>
/* Nuevo botón */
.update-button {
  background: linear-gradient(to right, #08b0df, #222291);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
}

.update-button:hover {
  background: linear-gradient(to right, #222291, #08b0df);
}

.evento-link {
  text-decoration: none;
  color: black;
  font-weight: bold;
}

.evento-link:hover {
  text-decoration: underline;
}

.partidos-container {
  display: flex;
  height: 100%;
  height: 100vh; /* Ajusta la altura total de la vista */
  overflow: hidden;
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
  overflow-y: auto;
}

.top-bar {
  background: #222291;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f4f4f4;
  overflow-y: auto;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  margin: 10px 0;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

router-link {
  color: blue;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}

h2 {
  color: blue;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
