<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6">Register</h1>

    <form @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>

      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input id="email" v-model="email" type="email" class="w-full" required />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input id="password" v-model="password" type="password" class="w-full" required minlength="6" />
        <p class="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
      </div>

      <div class="flex items-center justify-between">
        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
        <router-link to="/login" class="text-blue-500 hover:text-blue-700">
          Already have an account?
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'RegisterView',

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    async function handleSubmit() {
      if (loading.value) return;

      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      const { error } = await authStore.register(email.value, password.value);

      if (error) {
        errorMessage.value = error;
        loading.value = false;
        return;
      }

      successMessage.value = 'Registration successful! You can now log in.';
      email.value = '';
      password.value = '';

      // Redirect to login page after a delay
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 1500);

      loading.value = false;
    }

    return {
      email,
      password,
      loading,
      errorMessage,
      successMessage,
      handleSubmit,
    };
  },
});
</script>
