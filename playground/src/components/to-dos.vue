<script setup lang="ts">
import { computed, ref } from 'vue'
import { queryDb } from '@livestore/livestore'
import { events, tables } from '../livestore/schema'
import { useStore, useQuery, useClientDocument } from 'vue-livestore'

const { store } = useStore()

// Query & subscription
const visibleTodos$ = queryDb(
  () => tables.todos.where({ deletedAt: null }),
  { label: 'visibleTodos' },
)

const { state: uiState, setState } = useClientDocument(tables.uiState)
const todos = useQuery(visibleTodos$)

// Events
const createTodo = () => {
  store.commit(events.todoCreated({ id: crypto.randomUUID(), text: uiState.value.newTodoText }))
  uiState.value.newTodoText = ''
}

const deleteTodo = (id: string) => {
  store.commit(events.todoDeleted({ id, deletedAt: new Date() }))
}

const toggleCompleted = (id: string) => {
  if (todos.value.find((todo) => todo.id === id)?.completed) {
    store.commit(events.todoUncompleted({ id }))
  } else {
    store.commit(events.todoCompleted({ id }))
  }
}

const newTodoText = computed<string>({
  get: () => uiState.value.newTodoText,
  set: (value: any) => setState({ newTodoText: value })
})
</script>

<template>
  <div class="todos">
    {{ uiState }}<br>
    Todos
    <div class="new-todo">
      <input
        type="text"
        v-model="newTodoText"
        @keyup.enter="createTodo"
      />
      <button @click="createTodo">Add Todo</button>
    </div>
    <div>
      <button @click="setState({ filter: 'all' })">All</button>
      <button @click="setState({ filter: 'active' })">Active</button>
      <button @click="setState({ filter: 'completed' })">Completed</button>
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
  </div>
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