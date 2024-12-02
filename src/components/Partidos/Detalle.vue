<template>
  <div class="detalle-container" v-if="evento">
    <div class="left-panel">
      <img src="/assets/images/balon2.png" alt="logo" />
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
          <thead>
            <tr>
              <th>Campo</th>
              <th>Información</th>
            </tr>
          </thead>
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
          </tbody>
        </table>

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

export default defineComponent({
  name: "Detalle",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const evento = ref(null);

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
.detalle-container {
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

.info-title {
  color: blue;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.team-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.team-logo {
  width: 20%;
  max-width: 150px;
  object-fit: contain;
  margin: 0 10px;
}

.vs-text {
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin: 0 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
}

th {
  background: #222291;
  color: white;
}

td {
  background: white;
  color: black;
}

.back-button {
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
