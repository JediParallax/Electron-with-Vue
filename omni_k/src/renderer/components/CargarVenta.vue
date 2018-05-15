<template>
   <div class="container">
       <h2 class="title">Cargar Venta</h2>
    <form class="formulario"  @submit.prevent="loadSale()">
        <input type="text" v-model="numero_documento" name='codigoProducto' class="input_family"  placeholder="Ingrese número de boleta" >
        <button type="submit"  class="btn_green inside_input">Cargar</button>
        <!-- barcode de ejemplo: 7800000179859 -->
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
            <!-- estudiar flexbox otra vez para asignar el tamaño mas optimo para cada columna -->
              <div class="table-row" v-for='item in sale.skus'>     
                  <div class="text td_element bigger">{{item.codigo}}</div>
                  <div class="text td_element">{{item.cantidad}}</div>
                  <div class="text td_element medium">$ {{price = parseInt(item.precio_unitario_iva * item.cantidad).toLocaleString()}}</div>
              </div>  
          </div>
       </div>
       <div class="precios">
          <p>Precio total <span>$ {{0}}</span></p>
       </div> 
    </div>
     <div class="aligned" v-show="notFoundMessage">
        <div class='warning'>Boleta no encontrada.</div>
     </div>
    
     <!-- <div v-if="this.errors.length > 0">
         <div v-for="error of errors" class="warning aligned">
            <p>Se ha encontrado el siguiente error:</p>   
            <p>{{error.message}}</p> 
         </div>
     </div> -->
  </div>
</template>

<script>
import { ipcRenderer } from "electron"

export default {
  name: "cargarVenta",
  data() {
    return {
      errors: [],
      result: false,
      notFoundMessage: false,
      numero_documento: "",
      price: 0,
      total_price: 0,
      sale: {}
    }
  },

  methods: {
    loadSale() {
      //ENVIAMOS EL NUMERO DE DOCUMENTO DE LA COMPRA, AL PROCESO PRINCIPAL PARA QUE BUSQUE EN LA BASE DE DATOS
      ipcRenderer.send("getSale", this.numero_documento)

      //IMPRIMISMOS EN CONSOLA LA RESPUESTA RECIBIDA DESDE EL MAIN PROCEESS
      ipcRenderer.on("sendSale", (event, arg) => {
        this.sale = arg
        if (this.sale.length == 0) {
          /*  this.errors.length = 0 */
          this.result = false
          this.notFoundMessage = true
        } else {
          /*   this.errors.length = 0 */
          this.notFoundMessage = false
          this.result = true
        }
        this.numero_documento = ""
      })
    },
    datosComprador() {
      this.$swal({
        html: `
            <h2 id="innerModal">Datos de Comprador</h2>
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
            <h2 id="innerModal">Datos del Documento</h2>
            <section class="fields">
              <div>Tipo: ${this.sale.tipo_doc}</div>
              <div>Número: ${this.sale.numero_doc}</div>
              <div>Fecha: ${this.sale.fecha_doc}</div>
              <div>Hora: ${this.sale.hora_doc} </div>
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
    white-space: nowrap

.modal_links
    display: flex;
    justify-content: space-around
    margin-top: 6%   

#cargarVentaTableSize
  max-height: 176px

.bigger
  flex: 3;

.medium
  flex: 2

</style>