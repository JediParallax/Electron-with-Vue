<template>
   <div class="container">
    <form class="formulario" >
        <input type="text" v-model="numero_documento" name='codigoProducto' class="input_family"  placeholder="Ingrese número de boleta" >
        <button type="button"  class="btn_green inside_input"  @click="loadSale()">Cargar</button>
    </form>
    <div v-if="submitted">
        <div v-if="errors && errors.length" class="aligned"> 
            <div v-for="error of errors">
                <div class="warning"> {{error.message}} </div>
            </div>
        </div> 
        <div class="modal_links">
          <a @click="datosComprador()">Ver datos de comprador</a>
          <a @click="datosDoc()">Ver datos de documento</a>
       </div>
    </div> 
  </div>
</template>

<script>
import { ipcRenderer } from "electron"

export default {
  name: "cargarVenta",
  data() {
    return {
      errors: [],
      submitted: false,
      numero_documento: "",
      sale: {}
    }
  },

  methods: {
    loadSale() {
      //ENVIAMOS EL NUMERO DE DOCUMENTO DE LA COMPRA, AL PROCESO PRINCIPAL PARA QUE BUSQUE EN LA BASE DE DATOS
      ipcRenderer.send("getSale", this.numero_documento)

      //IMPRIMISMOS EN CONSOLA LA RESPUESTA RECIBIDA DESDE EL MAIN PROCEESS
      ipcRenderer.on("sendSale", (event, arg) => {
        //console.log("respuesta recibida desde el main process", arg) // imprime "pong"
        this.sale = arg
      })

      // ipcRenderer.removeAllListeners('sendSale')
      // ipcRenderer.removeAllListeners('getSale')

      this.submitted = true
    },

    datosComprador() {
      this.$swal({
        html: `
            <h2 id="innerModal">Datos de Comprador</h2>
            <section class="fields">
              <div>Nombre: ${this.sale.cliente.nombre}</div>
              <div>RUT: ${this.sale.cliente.rut}</div>
              <div>Telefono: ${this.sale.cliente.celular}</div>
              <div>Correo: ${this.sale.cliente.email} </div>
              <div>Dirección: ${this.sale.cliente.direccion}</div>
            </section>
        `,
        showConfirmButton: false
      })
    },
    datosDoc() {
      this.$swal({
        html: `
            <h2 id="innerModal">Datos del Documento</h2>
            <section class="fields">
              <div>Número de Doc: ${this.sale.numero_doc}</div>
              <div>Tipo de Doc: ${this.sale.tipo_doc}</div>
              <div>Fecha de Doc: ${this.sale.fecha_doc}</div>
              <div>Hora de Doc: ${this.sale.hora_doc} </div>
              <div>Codigo de Tienda: ${this.sale.codigo_tienda}</div>
            </section>
        `,
        showConfirmButton: false
      })
    }
  }
  // destroyer() {
  //   ipcRenderer.removeAllListeners();
  //   // ipcRenderer.removeAllListeners('getSale');
  // }
}
</script>

<style lang="sass">


h2#innerModal
    margin-bottom: 33px;
  
.fields
  display: flex
  flex-flow: wrap column
  align-items: flex-start
  div
    padding: 7px

.modal_links
    display: flex;
    justify-content: space-around
    margin-top: 6%

   
</style>