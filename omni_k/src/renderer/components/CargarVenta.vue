<template>
   <div class="container">
       <h2 class="title">Cargar Venta</h2>
    <form class="formulario"  @submit.prevent="loadSale()">
        <input type="text" v-model="numero_documento" name='codigoProducto' class="input_family"  placeholder="Ingrese número de boleta" >
        <button type="submit"  class="btn_green inside_input">Cargar</button>
        <!--  boleta de ejemplo: 4897 -->
    </form>
    <div v-show="result">
        <div class="modal_links">
          <a @click="datosComprador()">Ver datos de comprador</a>
          <a @click="datosDoc()">Ver datos de documento</a>
       </div>
       <div class="table">
          <div class="table-row header">   
              <div class="text th_element bigger">Código</div>
              <div class="text th_element">Cant.</div>
              <div class="text th_element medium">Precio</div>
          </div>
          <div class="table-body" id="cargarVentaTableSize">
              <div class="table-row" v-for='item in sale.skus'>     
                  <div class="text td_element bigger">{{item.codigo}}</div>
                  <div class="text td_element">{{item.cantidad}}</div>
                  <div class="text td_element medium">$ {{parseInt(item.precio).toLocaleString()}}</div>
              </div>  
          </div>
       </div>
       <div class="underTable">
          <button @click ="alertDisplay()" class="btn_blue_border">Hacer Pedido Express</button>
          <p>Precio total: <span class="cifra">$ {{total_price}}</span></p>
       </div>
    </div>
     <div class="aligned" v-show="notFoundMessage">
        <div class='warning'>Boleta no encontrada.</div>
     </div>
     <div v-show="isError">
         <div v-for="error of errors" class="warning aligned">
            <p>{{error.descripcion}}</p>   
            <p>{{error.catch.name}}</p> 
            <p>{{error.catch.code}}</p>
            <p>{{error.catch.number}} </p>
            <p>{{error.catch.state}} </p>
         </div>
     </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron"
import axios from "axios"

export default {
  name: "cargarVenta",
  data() {
    return {
      errors: [],
      result: false,
      notFoundMessage: false,
      isError: false,
      numero_documento: "",
      sale: {},
      total_price: "",
      url: "http://200.14.252.14:3001/omni_prueba/VentaOmni/"
    }
  },

  methods: {
    loadSale() {
      //INICIALMENTE ELIMINAMOS LOS RENDERER_PROCESS OYENTES que envian el numero de documento al MAIN_PROCESS
      ipcRenderer.removeAllListeners("sendSale")
      ipcRenderer.removeAllListeners("getSale")
      //ENVIAMOS EL NUMERO DE DOCUMENTO DE LA COMPRA, AL PROCESO PRINCIPAL PARA QUE BUSQUE EN LA BASE DE DATOS
      ipcRenderer.send("getSale", this.numero_documento)

      //IMPRIMISMOS EN CONSOLA LA RESPUESTA RECIBIDA DESDE EL MAIN PROCEESS
      ipcRenderer.on("sendSale", (event, arg) => {
        console.log("DATOS ENVIADOS DESDE EL MAIN PROCESS: ", arg) //ONLY DEPURATION
        this.sale = arg

        if (this.sale.skus) {
          this.errors.length = 0
          this.notFoundMessage = false
          this.isError = false
          this.total_price = parseInt(this.sale.documento.precio_total).toLocaleString()
          this.result = true
        } else {
          this.errors.length = 0
          this.isError = false
          this.result = false
          this.notFoundMessage = true
        }
        if (this.sale.error) {
          if (this.sale.error.catch.number) {
            this.notFoundMessage = false
            this.result = false
            this.errors.length = 0
            this.errors.push(this.sale.error)
            this.isError = true
          }
        }
        this.numero_documento = ""
      })
    },
    completeSale() {
      axios
        .post(this.url, this.sale)
        .then(response => {
          if (response.data.success) {
            this.$swal({
              type: "success",
              title: "Pedido express enviado",
              showConfirmButton: false,
              timer: 1500
            })
            console.log(response)
            this.result = false
          }
        })
        .catch(e => {
          this.$swal({
            type: "error",
            title: "Error al enviar pedido",
            showConfirmButton: false
          })
          this.$swal.showValidationError(e)
          console.log(e)
        })
    },
    alertDisplay() {
      this.$swal({
        title: "¿Enviar Pedido Express?",
        text: "no podrás revertir esta opción",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Enviar",
        cancelButtonText: "No Enviar",
        showCloseButton: true,
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then(result => {
        if (result.value) {
          this.completeSale()
        }
      })
    },
    datosComprador() {
      this.$swal({
        html: `
            <h2 class="innerModal">Datos de Comprador</h2>
            <section class="fields">
              <div class="longName">Nombre: ${this.sale.cliente.nombre}</div>       
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
            <h2 class="innerModal">Datos del Documento</h2>
            <section class="fields">
              <div>Tipo: ${this.sale.documento.tipo}</div>
              <div>Número: ${this.sale.documento.numero}</div>
              <div>Fecha: ${this.sale.documento.fecha}</div>
              <div>Hora: ${this.sale.documento.hora} </div>
              <div>Codigo de Tienda: ${this.sale.tienda.codigo_simple}</div>
            </section>
        `,
        showConfirmButton: false
      })
    }
  }
}
</script>

<style lang="sass">

#cargarVentaTableSize
  max-height: 165px

.underTable 
    display: flex
    margin: 0 17px
    justify-content: space-around
    p
      margin-top: 10px

</style>