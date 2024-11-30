import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Auth/Login.vue";
import Signup from "../components/Auth/Signup.vue";
import Partidos from "../components/Partidos/Partidos.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/partidos", component: Partidos },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
