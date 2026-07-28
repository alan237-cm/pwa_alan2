<template>
  <component
    :is="currentView"
    @go-login="currentView = Login"
    @go-register="currentView = Register"
    @login-success="currentView = Home"
    @go-almacen="currentView = Almacen"
    @go-home="currentView = Home"
  />

  <v-snackbar
    v-model="snackbar"
    :color="color"
    timeout="3000"
    location="top"
  >
    {{ mensaje }}
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './components/Home.vue'
import Almacen from './components/Almacen.vue'

const currentView = ref(Login)

const snackbar = ref(false)
const mensaje = ref('')
const color = ref('success')

const actualizarConexion = () => {
  if (navigator.onLine) {
    mensaje.value = 'Conexión restaurada'
    color.value = 'success'
  } else {
    mensaje.value = 'Sin conexión a Internet'
    color.value = 'error'
  }

  snackbar.value = true
}

onMounted(() => {
  window.addEventListener('online', actualizarConexion)
  window.addEventListener('offline', actualizarConexion)
})

onUnmounted(() => {
  window.removeEventListener('online', actualizarConexion)
  window.removeEventListener('offline', actualizarConexion)
})
</script>