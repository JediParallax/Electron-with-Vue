<template>
  <div class="container">
    <h2 class="title">Configuración</h2>
    <div class="config_form" >
      <!-- <label>Elija una Bases de Datos: </label> -->
      {{selectOfDBs}}
      <select v-model="selectedDatabase" class="input_family">
        <option selected value="selecciona">Elija una Bases de Datos</option>
        <option v-for="database in databases">
          {{database.name}}
        </option>
      </select>
      <button @click="modalDisplay()" class="btn_blue_border">guardar</button>
    </div>
   
  </div>
</template>

<script>
import { ipcRenderer } from "electron"
export default {
  name: "configuracion",
  data() {
    return {
      databases: {},
      selectedDatabase: ""
    }
  },
  /*  created() {
    if (!this.database) {
        ipcRenderer.send("database")
        ipcRenderer.on("sentDB", (event, arg) => {
          this.databases = arg
          console.log(this.databases)
          ipcRenderer.removeAllListeners("sentDB")
          ipcRenderer.removeAllListeners("database")
        })
      }
  }, */
  computed: {
    selectOfDBs() {
      ipcRenderer.send("database")
      ipcRenderer.on("sentDB", (event, arg) => {
        this.databases = arg
        console.log(this.databases)
        ipcRenderer.removeAllListeners("sentDB")
        ipcRenderer.removeAllListeners("database")
      })
    }
  },
  methods: {
    modalDisplay() {
      this.$swal({
        title: "¿Deséa configurar esta Base de datos por defecto?",
        type: "question",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Configurar",
        confirmButtonClass: "btn_green btn_in_swal",
        cancelButtonText: "Cancelar",
        cancelButtonClass: "btn_orange btn_in_swal",
        showCloseButton: true,
        allowOutsideClick: () => !this.$swal.isLoading()
      })
        .then(result => {
          if (result.value) {
            this.sendDB()
          }
        })
        .catch(e => {
          this.$swal({
            type: "error",
            title: "Ha ocurrido un inconveniente",
            showConfirmButton: false
          })
          this.$swal.showValidationError(e)
        })
    },
    sendDB() {
      if (this.selectedDatabase == "selecciona") {
        this.$swal({
          type: "error",
          title: "Debe seleccionar una base de datos válida",
          showConfirmButton: false,
          timer: 2000
        })
      } else {
        ipcRenderer.send("selectedDatabase", this.selectedDatabase)
        this.$swal({
          type: "success",
          title: "Hecho",
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  }
}
</script>

<style lang="sass">

  .config_form
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    button
      margin-top: 20px;

</style>