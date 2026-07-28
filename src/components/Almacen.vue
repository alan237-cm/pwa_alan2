<template>
  <v-app>

    <!-- APP BAR -->
    <v-app-bar
      color="pink-darken-4"
    >
      <v-btn
        icon
        @click="emit('go-home')"
      >
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-btn>

      <v-toolbar-title>
        Almacén
      </v-toolbar-title>
    </v-app-bar>

    <!-- CONTENIDO -->
    <v-main>

      <v-container>

        <v-card
          class="mt-5"
          elevation="8"
        >

          <v-card-title
            class="bg-pink-darken-4 text-white"
          >
            Almacén
          </v-card-title>

          <v-card-text>

            <v-btn
              color="pink-darken-2"
              prepend-icon="mdi-plus"
              class="mb-4"
              @click="abrirAgregar"
            >
              Agregar Registro
            </v-btn>

            <v-data-table
              :headers="headers"
              :items="almacenes"
            >

              <template
                #item.acciones="{ item }"
              >

                <v-btn
                  icon
                  color="warning"
                  class="mr-2"
                  @click="abrirEditar(item)"
                >
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>

                <v-btn
                  icon
                  color="error"
                  @click="eliminarAlmacen(item.id)"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>

              </template>

            </v-data-table>

          </v-card-text>

        </v-card>

      </v-container>

    </v-main>

    <!-- DIALOGO -->
    <v-dialog
      v-model="dialog"
      max-width="500"
    >

      <v-card>

        <v-card-title>
          {{
            editando
              ? 'Editar Registro'
              : 'Agregar Registro'
          }}
        </v-card-title>

        <v-card-text>

          <v-text-field
            v-model="form.codigo"
            label="Código"
          />

          <v-text-field
            v-model="form.descripcion"
            label="Descripción"
          />

        </v-card-text>

        <v-card-actions>

          <v-spacer />

          <v-btn
            color="grey"
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="pink-darken-2"
            @click="guardarAlmacen"
          >
            {{
              editando
                ? 'Actualizar'
                : 'Guardar'
            }}
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { db } from '../firebase'

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'

const emit = defineEmits([
  'go-home'
])

const almacenes = ref([])

const dialog = ref(false)

const editando = ref(false)

const almacenId = ref(null)

const form = ref({
  codigo: '',
  descripcion: ''
})

const headers = [
  {
    title: 'Código',
    key: 'codigo'
  },
  {
    title: 'Descripción',
    key: 'descripcion'
  },
  {
    title: 'Acciones',
    key: 'acciones',
    sortable: false
  }
]

onMounted(() => {

  onSnapshot(
    collection(db, 'almacen'),
    (snapshot) => {

      almacenes.value =
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
    }
  )

})

function abrirAgregar() {

  editando.value = false

  almacenId.value = null

  form.value = {
    codigo: '',
    descripcion: ''
  }

  dialog.value = true
}

function abrirEditar(almacen) {

  editando.value = true

  almacenId.value = almacen.id

  form.value = {
    codigo: almacen.codigo,
    descripcion: almacen.descripcion
  }

  dialog.value = true
}

async function guardarAlmacen() {

  try {

    if (editando.value) {

      await updateDoc(
        doc(
          db,
          'almacen',
          almacenId.value
        ),
        {
          codigo: form.value.codigo,
          descripcion:
            form.value.descripcion
        }
      )

    } else {

      await addDoc(
        collection(db, 'almacen'),
        {
          codigo: form.value.codigo,
          descripcion:
            form.value.descripcion
        }
      )
    }

    dialog.value = false

  } catch (error) {

    console.error(error)
  }
}

async function eliminarAlmacen(id) {

  if (
    !confirm(
      '¿Deseas eliminar este registro?'
    )
  ) {
    return
  }

  try {

    await deleteDoc(
      doc(
        db,
        'almacen',
        id
      )
    )

  } catch (error) {

    console.error(error)
  }
}
</script>