<template>
  <div class="detalle-container" v-if="evento">
    <div class="left-panel">
      <img src="/assets/images/balon2.png" alt="logo" class="logo-balon" />
    </div>
    <div class="right-panel">
      <div class="top-bar">Información del Partido</div>
      <div class="content">
        <!-- Imágenes de los equipos -->
        <div class="team-logos">
          <img :src="evento.strHomeTeamBadge" alt="Local" class="team-logo" />
          <span class="vs-text">VS</span>
          <img :src="evento.strAwayTeamBadge" alt="Visitante" class="team-logo" />
        </div>

        <!-- Tabla de información -->
        <table>
          <tbody>
            <tr>
              <th>Fecha</th>
              <td>{{ evento.dateEvent }}</td>
            </tr>
            <tr>
              <th>Hora</th>
              <td>{{ evento.strTime }}</td>
            </tr>
            <tr>
              <th>Local</th>
              <td>{{ evento.strHomeTeam }}</td>
            </tr>
            <tr>
              <th>Visitante</th>
              <td>{{ evento.strAwayTeam }}</td>
            </tr>
            <tr>
              <th>Estadio</th>
              <td>{{ evento.strVenue }}</td>
            </tr>
            <tr>
              <th>Clima</th>
              <td>
                Temperatura: {{ evento.clima.temperature }}°C<br />
                Viento: {{ evento.clima.wind_speed }} km/h<br />
                Descripción: {{ evento.clima.description }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pronóstico AI -->
        <div class="pronostico-ai">
          <h3>Pronóstico AI</h3>
          <p>{{ evento.pronostico }}</p>
        </div>

        <!-- Botón para regresar -->
        <button class="back-button" @click="regresar">Regresar</button>
      </div>
    </div>
  </div>
  <div v-else class="error-container">
    <p>No hay información disponible para este evento.</p>
    <button class="back-button" @click="regresar">Regresar</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";


interface Clima {
  temperature: string;
  wind_speed: string;
  description: string;
}

interface Evento {
  idEvent: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  dateEvent: string;
  strTime: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strVenue: string;
  clima: Clima;
  pronostico: string;
}

export default defineComponent({
  name: "Detalle",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const evento = ref<Evento | null>(null);

    onMounted(() => {
      const storedEvents = JSON.parse(localStorage.getItem("eventos") || "[]");
      const eventId = route.params.id;
      evento.value = storedEvents.find((event: any) => event.idEvent === eventId);
    });

    const regresar = () => {
      router.push("/partidos");
    };

    return {
      evento,
      regresar,
    };
  },
});
</script>

<style scoped>
/* Contenedor principal */
.detalle-container {
  display: flex;
  height: 100%;
}

/* Panel izquierdo */
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

/* Panel derecho */
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
  font-size: 24px;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f4f4f4;
}

/* Tabla de información */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  margin-top: 30px;
}

th,
td {
  padding: 5px; /* Reduce el tamaño de las filas */
  border: 1px solid #ccc;
}

th {
  background: #222291;
  color: white;
  text-align: left;
}

td {
  background: white;
  color: black;
  text-align: center;
}

/* Imágenes de los equipos */
.team-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.team-logo {
  width: 25%;
  max-width: 180px;
  object-fit: contain;
  margin: 0 20px;
}

.vs-text {
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin: 0 10px;
}

/* Pronóstico AI */
.pronostico-ai {
  margin-top: 0px;
  padding: 5px;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.pronostico-ai h3 {
  color: #222291;
  font-size: 20px;
  margin-bottom: 10px;
}

.pronostico-ai p {
  font-size: 16px;
  color: black;
  text-align: justify;
}

/* Botón */
.back-button {
  margin-top: 10px;
  background: linear-gradient(to right, #08b0df, #222291);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.back-button:hover {
  background: linear-gradient(to right, #222291, #08b0df);
}
</style>
