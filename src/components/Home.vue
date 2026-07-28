<template>
  <v-app>

    <!-- APP BAR -->
    <v-app-bar
      color="pink-darken-4"
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
      />

      <v-toolbar-title>
        Mi Proyecto
      </v-toolbar-title>
    </v-app-bar>

    <!-- MENU -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      color="pink-lighten-5"
    >
<v-list>

  <v-list-item
    prepend-icon="mdi-package-variant"
    title="Productos"
  />
<v-list-item
  prepend-icon="mdi-warehouse"
  title="Almacén"
  @click="emit('go-almacen')"
/>

</v-list>
    </v-navigation-drawer>

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
            Productos
          </v-card-title>

          <v-card-text>

            <v-btn
              color="pink-darken-2"
              prepend-icon="mdi-plus"
              class="mb-4"
              @click="abrirAgregar"
            >
              Agregar Producto
            </v-btn>

            <v-data-table
              :headers="headers"
              :items="productos"
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
                  @click="eliminarProducto(item.id)"
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
              ? 'Editar Producto'
              : 'Agregar Producto'
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
          <v-select
            v-model="form.almacenId"
            :items="almacenes"
            item-title="descripcion"
            item-value="id"
            label="Almacén"
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
            @click="guardarProducto"
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
  'go-almacen'
])
const drawer = ref(false)

const productos = ref([])
const almacenes = ref([])

const dialog = ref(false)

const editando = ref(false)

const productoId = ref(null)

const form = ref({
  codigo: '',
  descripcion: '',
  almacenId: ''
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
    title: 'Almacén',
    key: 'almacenNombre'
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

  onSnapshot(
    collection(db, 'productos'),
    (snapshot) => {

      productos.value =
        snapshot.docs.map((d) => {

          const producto = {
            id: d.id,
            ...d.data()
          }

          const almacen =
            almacenes.value.find(
              a => a.id === producto.almacenId
            )

          return {
            ...producto,
            almacenNombre:
              almacen?.descripcion || ''
          }
        })
    }
  )

})

function abrirAgregar() {

  editando.value = false

  productoId.value = null

  form.value = {
  codigo: '',
  descripcion: '',
  almacenId: ''
}

  dialog.value = true
}

function abrirEditar(producto) {

  editando.value = true

  productoId.value = producto.id

 form.value = {
  codigo: producto.codigo,
  descripcion: producto.descripcion,
  almacenId: producto.almacenId
}

  dialog.value = true
}

async function guardarProducto() {

  try {

    if (editando.value) {

      await updateDoc(
        doc(
          db,
          'productos',
          productoId.value
        ),
        {
          codigo: form.value.codigo,
          descripcion:
          form.value.descripcion,
          almacenId:
          form.value.almacenId
        }
      )

    } else {

      await addDoc(
        collection(db, 'productos'),
        {
          codigo: form.value.codigo,
          descripcion:
            form.value.descripcion,
          almacenId:
            form.value.almacenId
        }
      )
    }

    dialog.value = false

  } catch (error) {

    console.error(error)
  }
}

async function eliminarProducto(id) {

  if (
    !confirm(
      '¿Deseas eliminar este producto?'
    )
  ) {
    return
  }

  try {

    await deleteDoc(
      doc(db, 'productos', id)
    )

  } catch (error) {

    console.error(error)
  }
}
</script>