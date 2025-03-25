<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todo';
import TodoItem from '@/components/TodoItem.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    TodoItem,
  },

  setup() {
    const todoStore = useTodoStore();

    const newTodo = ref({
      title: '',
      description: '',
    });

    async function handleAddTodo() {
      if (todoStore.loading) return;

      const { error } = await todoStore.addTodo(newTodo.value.title, newTodo.value.description);

      if (!error) {
        // Reset form
        newTodo.value = {
          title: '',
          description: '',
        };
      }
    }

    async function handleToggleComplete(id, completed) {
      await todoStore.toggleComplete(id, completed);
    }

    async function handleDeleteTodo(id) {
      if (confirm('Are you sure you want to delete this task?')) {
        await todoStore.deleteTodo(id);
      }
    }

    onMounted(() => {
      todoStore.fetchTodos();
    });

    return {
      todoStore,
      newTodo,
      handleAddTodo,
      handleToggleComplete,
      handleDeleteTodo,
    };
  },
});
</script>
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">My Todo List</h1>

    <!-- Add New Todo Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4">Add New Task</h2>
      <form @submit.prevent="handleAddTodo">
        <div class="mb-4">
          <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Task Title</label>
          <input id="title" v-model="newTodo.title" type="text" class="w-full" placeholder="What needs to be done?"
            required />
        </div>

        <div class="mb-4">
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
          <textarea id="description" v-model="newTodo.description" class="w-full" rows="3"
            placeholder="Add details about this task..."></textarea>
        </div>

        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500"
          :disabled="todoStore.loading">
          {{ todoStore.loading ? 'Adding...' : 'Add Task' }}
        </button>
      </form>
    </div>

    <!-- Todo List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">My Tasks</h2>

      <div v-if="todoStore.loading && !todoStore.todos.length" class="py-4 text-center text-gray-500">
        Loading tasks...
      </div>

      <div v-else-if="!todoStore.todos.length" class="py-4 text-center text-gray-500">
        No tasks yet. Add one above!
      </div>

      <TodoItem v-for="todo in todoStore.todos" :key="todo.id" :todo="todo" @toggle-complete="handleToggleComplete"
        @delete="handleDeleteTodo" />
    </div>
  </div>
</template>
