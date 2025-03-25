<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TodoItem',

  props: {
    todo: {
      type: Object,
      required: true,
    },
  },

  emits: ['toggle-complete', 'delete'],

  setup(props, { emit }) {
    function toggleComplete() {
      emit('toggle-complete', props.todo.id, !props.todo.completed);
    }

    function formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }

    return {
      toggleComplete,
      formatDate,
    };
  },
});
</script>

<template>
  <div class="border-b border-gray-200 py-4 flex items-start gap-4">
    <input type="checkbox" :checked="todo.completed" @change="toggleComplete"
      class="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500" />

    <div class="flex-1">
      <h3 class="text-lg font-medium" :class="{ 'line-through text-gray-400': todo.completed }">
        {{ todo.title }}
      </h3>
      <p v-if="todo.description" class="text-gray-600 mt-1" :class="{ 'text-gray-400': todo.completed }">
        {{ todo.description }}
      </p>
      <p class="text-xs text-gray-500 mt-2">
        Created: {{ formatDate(todo.created_at) }}
      </p>
    </div>

    <button @click="$emit('delete', todo.id)" class="text-red-500 hover:text-red-700 p-1" title="Delete task">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>
