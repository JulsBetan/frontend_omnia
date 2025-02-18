import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Auth/LoginOmnia.vue";
import Signup from "../components/Auth/SignupOmnia.vue";
import Partidos from "../components/Partidos/Partidos.vue";
import Inicio from "../components/Inicio/Inicio.vue";
import Dashboard from "../components/Inicio/Dashboard.vue";
import Companies from "../components/Inicio/Companies.vue";
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
      { path: 'participantes', component: Participants },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de navegación
// router.beforeEach(async (to, _, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//       console.warn("No token found. Redirecting to login.");
//       next("/login");
//     } else {
//       try {
//         console.log("Validating token with backend...");
//         const response = await axios.post(`${URL_DEPORTES}/users/validate-token`, { token });
//         if (response.data.valid) {
//           console.log("Token valid. Proceeding to route.");
//           next();
//         } else {
//           console.warn("Invalid token. Redirecting to login.");
//           localStorage.removeItem("access_token");
//           next("/login");
//         }
//       } catch (error) {
//         console.error("Error validating token:", error);
//         localStorage.removeItem("access_token");
//         next("/login");
//       }
//     }
//   } else {
//     next();
//   }
// });
//
//
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
