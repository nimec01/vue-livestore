<script setup lang="ts">
import { ref } from 'vue'
import { queryDb } from '@livestore/livestore'
import { events, tables } from './livestore/schema'
import { useStore, useQuery } from 'vue-livestore'

const { store } = useStore()

// // Query & subscription

// const visibleTodos$ = queryDb(
//   (get) => {
//     return tables.todos.where({
//       deletedAt: null
//     })
//   },
//   { label: 'visibleTodos' }
// )

// const todos = useQuery(visibleTodos$)

// // Events

// const newTodoText = ref('')
// const createTodo = () => {
//   store.commit(events.todoCreated({ id: crypto.randomUUID(), text: newTodoText.value }))
//   newTodoText.value = ''
// }

// const deleteTodo = (id: string) => {
//   store.commit(events.todoDeleted({ id, deletedAt: new Date() }))
// }

// const toggleCompleted = (id: string) => {
//   if (todos.value.find((todo) => todo.id === id)?.completed) {
//     store.commit(events.todoUncompleted({ id }))
//   } else {
//     store.commit(events.todoCompleted({ id }))
//   }
// }
</script>

<template>
  <div>
    HERE
    {{ store }}
  </div>
  <!-- <div class="todos">
    Todos
    <div class="new-todo">
      <input
        type="text"
        v-model="newTodoText"
        @keyup.enter="createTodo"
      />
      <button @click="createTodo">Add Todo</button>
    </div>
    <div
      v-for="todo in todos"
      :key="todo.id"
      class="todo"
    >
      <span :class="{ completed: todo.completed }">
        {{ todo.text }}
      </span>
      <button @click="toggleCompleted(todo.id)">Complete</button>
      <button @click="deleteTodo(todo.id)">Delete</button>
    </div>
  </div> -->
</template>

<style>
.completed {
  text-decoration: line-through;
}

.todos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo,
.new-todo {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}
</style>
