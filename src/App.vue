<template>
  <div class="min-h-screen">
    <header v-if="authStore.isAuthenticated" class="bg-white shadow">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold text-blue-600">Todo App</router-link>
        <button 
          @click="authStore.logout" 
          class="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
        >
          Logout
        </button>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'App',
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
});
</script>
