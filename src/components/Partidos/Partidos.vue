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
        <div class="column">
          <div class="league-header">
            <img src="/assets/images/espana.png" alt="La Liga Española" class="league-logo" />
            <p class="league-title">La Liga Española</p>
          </div>
          <ul v-if="eventosLigaEspanola.length > 0">
            <li v-for="(partido, index) in eventosLigaEspanola" :key="index" class="evento-item">
              <router-link 
                :to="{ name: 'DetalleEvento', params: { id: partido.idEvent } }"
                class="evento-link"
              >
                <div class="evento-details">
                  <span class="evento-equipos">{{ partido.strHomeTeam }} vs {{ partido.strAwayTeam }}</span>
                  <span class="evento-fecha">{{ partido.dateEvent }}</span>
                </div>
              </router-link>
            </li>
          </ul>
          <p v-else>Cargando partidos...</p>
        </div>
        <div class="column">
          <div class="league-header">
            <img src="/assets/images/brazil.png" alt="Liga Brasileña" class="league-logo" />
            <p class="league-title">Liga Brasileña</p>
          </div>
          <ul v-if="eventosLigaBrasileña.length > 0">
            <li v-for="(partido, index) in eventosLigaBrasileña" :key="index" class="evento-item">
              <router-link 
                :to="{ name: 'DetalleEvento', params: { id: partido.idEvent } }"
                class="evento-link"
              >
                <div class="evento-details">
                  <span class="evento-equipos">{{ partido.strHomeTeam }} vs {{ partido.strAwayTeam }}</span>
                  <span class="evento-fecha">{{ partido.dateEvent }}</span>
                </div>
              </router-link>
            </li>
          </ul>
          <p v-else>Cargando partidos...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

const URL_DEPORTES = import.meta.env.VITE_API_DEPORTES_URL;

if (!URL_DEPORTES) {
  console.error("VITE_API_DEPORTES_URL no está definida en las variables de entorno.");
}

export default defineComponent({
  name: "Partidos",
  setup() {
    const eventos = ref<any[]>([]);
    const eventosLigaEspanola = ref<any[]>([]);
    const eventosLigaBrasileña = ref<any[]>([]);

    const fetchEventos = async (forceUpdate = false) => {
      try {
        if (!forceUpdate) {
          const cachedEventos = localStorage.getItem("eventos");
          if (cachedEventos) {
            console.log("Usando eventos de localStorage");
            eventos.value = JSON.parse(cachedEventos);
            dividirEventosPorLiga();
            return;
          }
        }

        console.log("Solicitando eventos desde la API...");
        const response = await axios.get(`${URL_DEPORTES}/events/next`);
        eventos.value = response.data;

        // Guardar en localStorage
        localStorage.setItem("eventos", JSON.stringify(response.data));
        dividirEventosPorLiga();
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    const dividirEventosPorLiga = () => {
      eventosLigaEspanola.value = eventos.value.filter((event) => event.idLeague === "4335");
      eventosLigaBrasileña.value = eventos.value.filter((event) => event.idLeague === "4351");
    };

    onMounted(() => {
      fetchEventos();
    });

    return { eventos, eventosLigaEspanola, eventosLigaBrasileña, fetchEventos };
  },
});
</script>

<style scoped>
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
  display: flex;
  justify-content: center;
  gap: 2rem; /* Espaciado entre columnas */
  padding: 20px;
  background: #f4f4f4;
}

.column {
  width: 45%; /* Ajusta el ancho para centrar mejor */
}

.league-header {
  text-align: center;
  margin-bottom: 20px;
}

.league-logo {
  width: 100px; /* Ajusta el tamaño del logo */
  height: auto;
  margin-bottom: 10px;
}

.league-title {
  font-size: 18px;
  color: #222291;
  font-weight: bold;
}

.evento-item {
  padding: 10px;
  margin: 10px 0;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.evento-link {
  text-decoration: none;
  color: black;
  font-weight: bold;
  width: 100%;
}

.evento-details {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.evento-equipos {
  text-align: center;
  flex: 2;
}

.evento-fecha {
  text-align: right;
  flex: 1;
}

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
</style>
