import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/supabase/client'; // Importa la instancia de Supabase

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  // Establece el usuario
  const setUser = (userData) => {
    user.value = userData;
  };

  // Obtiene el usuario desde Supabase
  const fetchUser = async () => {
    const { data: { user: userData }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error al obtener el usuario:', error.message);
    } else {
      user.value = userData;
    }
  };

  // Limpia el usuario (para cerrar sesión)
  const clearUser = () => {
    user.value = null;
  };

  return { user, setUser, fetchUser, clearUser };
});
