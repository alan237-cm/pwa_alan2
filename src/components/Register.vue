
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
        <div class="text-center mb-6">
          <v-icon
            size="80"
            color="light-blue-accent-2"
          >
            mdi-account-plus
          </v-icon>

          <h1 class="text-h4 font-weight-bold text-white">
            Crear Cuenta
          </h1>

          <p class="text-blue-lighten-3">
            Regístrate para comenzar
          </p>
        </div>

        <!-- EMAIL -->
        <v-text-field
          v-model="email"
          label="Correo electrónico"
          prepend-inner-icon="mdi-email"
          variant="solo-filled"
          color="light-blue"
          @input="validateEmail"
        ></v-text-field>

        <p
          v-if="!isEmailValid && email.length > 0"
          class="text-red text-caption mb-4"
        >
          Correo inválido
        </p>

        <!-- PASSWORD -->
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="
            showPassword
              ? 'mdi-eye'
              : 'mdi-eye-off'
          "
          @click:append-inner="showPassword = !showPassword"
          variant="solo-filled"
          color="light-blue"
          @input="validatePassword"
        ></v-text-field>

        <!-- REGLAS -->
        <div class="mt-3 mb-6">
          <div class="rule">
            <v-icon
              size="16"
              :color="hasMinLength ? 'green' : 'red'"
            >
              {{
                hasMinLength
                  ? 'mdi-check-circle'
                  : 'mdi-close-circle'
              }}
            </v-icon>

            <span
              :class="
                hasMinLength
                  ? 'text-green'
                  : 'text-red'
              "
            >
              Mínimo 8 caracteres
            </span>
          </div>

          <div class="rule">
            <v-icon
              size="16"
              :color="hasUppercase ? 'green' : 'red'"
            >
              {{
                hasUppercase
                  ? 'mdi-check-circle'
                  : 'mdi-close-circle'
              }}
            </v-icon>

            <span
              :class="
                hasUppercase
                  ? 'text-green'
                  : 'text-red'
              "
            >
              Una mayúscula
            </span>
          </div>

          <div class="rule">
            <v-icon
              size="16"
              :color="hasNumber ? 'green' : 'red'"
            >
              {{
                hasNumber
                  ? 'mdi-check-circle'
                  : 'mdi-close-circle'
              }}
            </v-icon>

            <span
              :class="
                hasNumber
                  ? 'text-green'
                  : 'text-red'
              "
            >
              Un número
            </span>
          </div>

          <div class="rule">
            <v-icon
              size="16"
              :color="hasSymbol ? 'green' : 'red'"
            >
              {{
                hasSymbol
                  ? 'mdi-check-circle'
                  : 'mdi-close-circle'
              }}
            </v-icon>

            <span
              :class="
                hasSymbol
                  ? 'text-green'
                  : 'text-red'
              "
            >
              Un símbolo
            </span>
          </div>
        </div>

        <!-- BOTON -->
        <v-btn
          block
          size="large"
          color="light-blue-accent-2"
          @click="register"
        >
          Registrar
        </v-btn>

        <!-- ALERTA -->
        <v-alert
          v-if="message"
          :type="alertType"
          class="mt-5"
        >
          {{ message }}
        </v-alert>
        <!-- IR A LOGIN -->
<div class="text-center mt-5">
  <span
    @click="$emit('go-login')"
    style="
      color: #f8bbd0;
      cursor: pointer;
      font-size: 14px;
    "
  >
    ¿Ya tienes cuenta?
    Inicia sesión
  </span>
</div>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

import { auth } from '../firebase'

import {
  createUserWithEmailAndPassword
} from 'firebase/auth'

const emit = defineEmits([
  'go-login'
])

const email = ref('')
const password = ref('')

const showPassword = ref(false)

const isEmailValid = ref(true)

const hasMinLength = ref(false)
const hasUppercase = ref(false)
const hasNumber = ref(false)
const hasSymbol = ref(false)

const message = ref('')
const alertType = ref('success')

const validateEmail = () => {
  const regex =
    /^[\w.-]+@[\w.-]+\.\w+$/

  isEmailValid.value =
    regex.test(email.value)
}

const validatePassword = () => {
  hasMinLength.value =
    password.value.length >= 8

  hasUppercase.value =
    /[A-Z]/.test(password.value)

  hasNumber.value =
    /[0-9]/.test(password.value)

  hasSymbol.value =
    /[!@#$%^&*(),.?":{}|<>]/.test(
      password.value
    )
}

const register = async () => {

  validateEmail()
  validatePassword()

  if (
    email.value === '' ||
    password.value === ''
  ) {
    alertType.value = 'warning'

    message.value =
      'Llena todos los campos'

    return
  }

  if (
    !isEmailValid.value ||
    !hasMinLength.value ||
    !hasUppercase.value ||
    !hasNumber.value ||
    !hasSymbol.value
  ) {
    alertType.value = 'error'

    message.value =
      'Verifica los datos correctamente'

    return
  }

  try {

    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    alertType.value = 'success'

    message.value =
      'Usuario creado correctamente'

    setTimeout(() => {
      emit('go-login')
    }, 1500)

  } catch (error) {

    alertType.value = 'error'

    message.value =
      'Error al registrar usuario'
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
  background: rgba(255, 255, 255, 0.07) !important;
  border: 1px solid rgba(255, 192, 203, 0.12);
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.08);
}

.rule {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.text-white {
  color: white;
}
</style>