<template>
  <v-app>
    <v-container
      fluid
      class="fill-height fondo d-flex justify-center align-center"
    >
      <v-card
        width="500"
        class="pa-8 glass rounded-xl"
        elevation="15"
      >
        <!-- ICONO -->
        <div class="text-center mb-6">
          <v-icon
            size="80"
            color="pink-accent-1"
          >
            mdi-account-heart
          </v-icon>

          <h1 class="text-h4 font-weight-bold text-white">
            Bienvenido
          </h1>

          <p style="color: #f8bbd0">
            Inicia sesión para continuar
          </p>
        </div>

        <!-- EMAIL -->
        <v-text-field
          v-model="email"
          label="Correo electrónico"
          prepend-inner-icon="mdi-email"
          variant="solo-filled"
          color="pink-darken-1"
        ></v-text-field>

        <!-- PASSWORD -->
        <v-text-field
          v-model="password"
          :type="
            showPassword
              ? 'text'
              : 'password'
          "
          label="Contraseña"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="
            showPassword
              ? 'mdi-eye'
              : 'mdi-eye-off'
          "
          @click:append-inner="
            showPassword =
              !showPassword
          "
          variant="solo-filled"
          color="pink-darken-1"
        ></v-text-field>
<v-btn
  block
  size="large"
  color="#b03060"
  class="mt-5"
  @click="login"
  :disabled="!online"
>
  Entrar
</v-btn>

        <!-- ALERTA -->
        <v-alert
          v-if="message"
          :type="alertType"
          class="mt-5"
        >
          {{ message }}
        </v-alert>

        <!-- IR A REGISTRO -->
        <div class="text-center mt-5">
          <span
            @click="$emit('go-register')"
            style="
              color: #f8bbd0;
              font-size: 14px;
              cursor: pointer;
            
            "
          >
            ¿No tienes cuenta?
            Regístrate
          </span>
        </div>

      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import { auth } from '../firebase'

import {
  signInWithEmailAndPassword
} from 'firebase/auth'

import SecureStorage from 'secure-web-storage'
import CryptoJS from 'crypto-js'

const emit = defineEmits([
  'go-register',
  'login-success'
])

const SECRET_KEY = 'mi_clave_secreta'

const secureStorage = new SecureStorage(localStorage, {
  hash: key =>
    CryptoJS.SHA256(
      key,
      SECRET_KEY
    ).toString(),

  encrypt: data =>
    CryptoJS.AES.encrypt(
      data,
      SECRET_KEY
    ).toString(),

  decrypt: data =>
    CryptoJS.AES.decrypt(
      data,
      SECRET_KEY
    ).toString(
      CryptoJS.enc.Utf8
    )
})

const email = ref('')
const password = ref('')

const showPassword = ref(false)

const message = ref('')
const alertType = ref('success')

// NUEVO
const online = ref(true)

const verificarConexion = async () => {
  try {
    await fetch(window.location.origin + '/favicon.ico', {
      method: 'HEAD',
      cache: 'no-store'
    })

    online.value = true
    message.value = ''
  } catch {
    online.value = false
    alertType.value = 'warning'
    message.value = 'Sin conexión a Internet. No es posible conectarse al servidor.'
  }
}

let intervalo

onMounted(() => {
  const ultimoCorreo = secureStorage.getItem('lastEmail')

  if (ultimoCorreo) {
    email.value = ultimoCorreo
  }

  verificarConexion()

  intervalo = setInterval(verificarConexion, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
})
onMounted(() => {

  const ultimoCorreo =
    secureStorage.getItem('lastEmail')

  if (ultimoCorreo) {
    email.value = ultimoCorreo
  }

  window.addEventListener(
    'online',
    actualizarEstado
  )

  window.addEventListener(
    'offline',
    actualizarEstado
  )

  actualizarEstado()

  setInterval(actualizarEstado, 2000)

})

onUnmounted(() => {
  window.removeEventListener(
    'online',
    actualizarEstado
  )

  window.removeEventListener(
    'offline',
    actualizarEstado
  )
})

const login = async () => {

  if (!online.value) {
    alertType.value = 'warning'
    message.value =
      'Sin conexión a Internet.'
    return
  }

  if (
    email.value === '' ||
    password.value === ''
  ) {
    alertType.value = 'warning'

    message.value =
      'Llena todos los campos'

    return
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    secureStorage.setItem(
      'lastEmail',
      email.value
    )

    password.value = ''

    alertType.value = 'success'

    message.value =
      'Acceso permitido'

    setTimeout(() => {
      emit('login-success')
    }, 1000)

  } catch (error) {

    alertType.value = 'error'

    message.value =
      'Correo o contraseña incorrectos'
  }
}
</script>

<style>
.fondo {
  background: linear-gradient(
    135deg,
    #14080e,
    #2b0a1f,
    #4a102a,
    #6d1a36
  );
}

.glass {
  backdrop-filter: blur(14px);

  background:
    rgba(255, 255, 255, 0.07)
    !important;

  border: 1px solid
    rgba(255, 192, 203, 0.12);

  box-shadow:
    0 0 30px
    rgba(255, 105, 180, 0.08);
}

.text-white {
  color: white;
}
</style>