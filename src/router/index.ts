import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Auth/LoginOmnia.vue";
import Signup from "../components/Auth/SignupOmnia.vue";
import Partidos from "../components/Partidos/Partidos.vue";
import Inicio from "../components/Inicio/Inicio.vue";
import Dashboard from "../components/Inicio/Dashboard.vue";
import Companies from "../components/Inicio/Companies.vue";
import CompaniesCreate from "../components/Inicio/CompaniesCreate.vue";
import Participants from "../components/Inicio/Participants.vue";
import Detalle from "../components/Partidos/Detalle.vue";
import axios from "axios";
import { supabase } from "@/supabase/client";

const URL_DEPORTES = import.meta.env.VITE_API_DEPORTES_URL;

if (!URL_DEPORTES) {
  console.error("VITE_API_DEPORTES_URL no está definida en las variables de entorno.");
}

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/partidos", component: Partidos, meta: { requiresAuth: true }, },
  { path: "/partidos/:id", name: "DetalleEvento", component: Detalle, meta: { requiresAuth: true }, props:  true },
  { path: "/inicio", 
    component: Inicio, 
    meta: { requiresAuth: true }, 
    children: [
      { path: '', component: Dashboard }, // Página principal
      { path: 'empresas', component: Companies },
      { path: 'empresas/alta', component: CompaniesCreate },
      { path: 'participantes', component: Participants },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔹 Bloquear rutas protegidas si no hay sesión
router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      next("/login"); // 🔹 Redirigir a login si no está autenticado
    } else {
      next();
    }
  } else {
    next();
  }
});
 
export default router;
