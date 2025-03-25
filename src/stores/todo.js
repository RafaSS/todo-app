import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchTodos() {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      todos.value = data;
      return { data, error: null };
    } catch (err) {
      error.value = err.message;
      return { data: null, error: err.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function addTodo(title, description = '') {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: addError } = await supabase
        .from('todos')
        .insert([{ title, description, completed: false }])
        .select()
        .single();
      
      if (addError) throw addError;
      
      todos.value = [data, ...todos.value];
      return { data, error: null };
    } catch (err) {
      error.value = err.message;
      return { data: null, error: err.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function updateTodo(id, updates) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: updateError } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      const index = todos.value.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        todos.value[index] = data;
      }
      
      return { data, error: null };
    } catch (err) {
      error.value = err.message;
      return { data: null, error: err.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function deleteTodo(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      todos.value = todos.value.filter((todo) => todo.id !== id);
      return { error: null };
    } catch (err) {
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function toggleComplete(id, completed) {
    return updateTodo(id, { completed });
  }
  
  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
});
