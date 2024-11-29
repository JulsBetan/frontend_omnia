import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Auth/Login.vue";
import Partidos from "../components/Partidos/Partidos.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/partidos", component: Partidos },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
