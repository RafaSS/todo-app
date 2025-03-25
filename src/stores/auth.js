import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  async function initialize() {
    loading.value = true;

    // Check for existing session
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      user.value = data.session.user;
    }

    // Setup auth state listener
    const { data: { subscription } } = await supabase.auth.onAuthStateChange(
      (_event, session) => {
        user.value = session?.user || null;
      },
    );

    loading.value = false;

    return subscription;
  }

  async function register(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('User logged in:', data.user);
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    initialize,
    register,
    login,
    logout,
  };
});
