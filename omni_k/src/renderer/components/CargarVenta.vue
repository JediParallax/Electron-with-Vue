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
           <a @click="inputFields()">ingresar</a>
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
         </div>
     </div>
    
  </div>
</template>



${this.sale.cliente.email}
<script>
import { ipcRenderer } from "electron"
import axios from "axios"
import { fail } from "assert"

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
        if (this.sale.skus && !this.sale.error) {
          this.errors.length = 0
          this.notFoundMessage = false
          this.isError = false
          this.total_price = parseInt(this.sale.documento.precio_total).toLocaleString()
          this.result = true
        } else if (this.sale.error.catch.number) {
          this.notFoundMessage = false
          this.result = false
          this.errors.length = 0
          this.errors.push(this.sale.error)
          this.isError = true
        } else {
          this.errors.length = 0
          this.isError = false
          this.result = false
          this.notFoundMessage = true
        }
        this.numero_documento = ""
      })
    },
    completeSale() {
      if (
        this.validations(
          this.sale.cliente.email,
          this.sale.cliente.rut,
          this.sale.cliente.direccion
        )
      ) {
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
          })
      } else
        this.$swal({
          title: "Datos del cliente incorrectos",
          text: "¿Desea agregar o corregir datos del cliente?",
          type: "warning",
          buttonsStyling: false,
          showCancelButton: true,
          confirmButtonText: "Agregar",
          confirmButtonClass: "btn_green btn_in_swal",
          cancelButtonText: "Salir",
          cancelButtonClass: "btn_orange btn_in_swal",
          showCloseButton: true,
          allowOutsideClick: () => !this.$swal.isLoading()
        }).then(result => {
          if (result.value) {
            this.inputFields()
          }
        })
    },
    alertDisplay() {
      this.$swal({
        title: "¿Enviar Pedido Express?",
        text: "no podrás revertir esta opción",
        type: "question",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Enviar",
        confirmButtonClass: "btn_green btn_in_swal",
        cancelButtonText: "No Enviar",
        cancelButtonClass: "btn_orange btn_in_swal",
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
    },
    inputFields: async function() {
      let flag = 0
      const { value: formValues } = await this.$swal({
        title: "Ingrese datos faltantes",
        html:
          '<form class="modalForm">' +
          `<input class="input_family" name="email" type="email" id="swal_email" placeholder="email" required />` +
          '<span id="first">*</span>' +
          '<input class="input_family" name="rut" type="text" placeholder="RUT" id="swal_RUT"  required />' +
          '<span id="second">*</span>' +
          '<input class="input_family" name="direccio" type="text" placeholder="Dirección" id="swal_direccion" required />' +
          '<span id="third">*</span>' +
          '<input class="input_family" name="direccion_al" type="text" placeholder="Dirección Alternativa" id="swal_alt_direccion" />' +
          '<input class="input_family" name="telefono" type="tel" placeholder="Teléfono" id="swal_telefono" />' +
          '<input class="input_family" name="celular" type="tel" placeholder="Celular" id="swal_celular" />' +
          "</form>",
        focusConfirm: false,
        buttonsStyling: false,
        showConfirmButton: true,
        confirmButtonText: "Actualizar",
        confirmButtonClass: "btn_blue_border",
        showCloseButton: true,
        showLoaderOnConfirm: true,
        focusConfirm: false,
        footer: "<span>*</span>" + " Email, RUT y Dirección son campos obligatorios",
        preConfirm: () => {
          var email = document.getElementById("swal_email").value
          if (this.validarVacio(email) && this.validarEmail(email)) {
            this.sale.cliente.email = email
          } else {
            flag = 1
            this.alertValidaciones(flag)
          }

          let RUT = document.getElementById("swal_RUT").value
          if (this.validarVacio(RUT) && this.validaRut(RUT)) {
            this.sale.cliente.rut = RUT
          } else {
            flag = 2
            this.alertValidaciones(flag)
          }

          let address = document.getElementById("swal_direccion").value
          let alt_address = document.getElementById("swal_alt_direccion").value
          if (this.validarVacio(address)) {
            this.sale.cliente.direccion = address
            this.sale.cliente.direccion_alt = alt_address
            console.log(address, alt_address)
          } else {
            flag = 3
            this.alertValidaciones(flag)
          }

          let phone = document.getElementById("swal_telefono").value
          console.log(phone)
          if (phone == null || phone.length == 0 || /^\s+$/.test(phone)) flag = 0
          else if (this.validarPhone(phone)) this.sale.cliente.telefono = phone
          else {
            flag = 4
            this.alertValidaciones(flag)
          }

          let cellphone = document.getElementById("swal_celular").value
          if (cellphone == null || cellphone.length == 0 || /^\s+$/.test(cellphone)) flag = 0
          else if (this.validarPhone(cellphone)) this.sale.cliente.celular = cellphone
          else {
            flag = 5
            this.alertValidaciones(flag)
          }
        }
      })
      if (formValues) {
        this.$swal({
          title: "Datos Actualizados",
          text: "¿Desea seguir con el Pedido Express?",
          type: "success",
          buttonsStyling: false,
          showCancelButton: true,
          confirmButtonText: "Hacer Pedido Express",
          confirmButtonClass: "btn_green btn_in_swal",
          cancelButtonText: "Aun no",
          cancelButtonClass: "btn_orange btn_in_swal",
          showCloseButton: true,
          allowOutsideClick: () => !this.$swal.isLoading()
        }).then(result => {
          if (result.value) {
            this.completeSale()
          }
        })
        console.log(this.sale.cliente)
      }
    },

    //*********************************VALIDACIONES********************************//
    alertValidaciones(x) {
      switch (x) {
        case 1:
          this.$swal.showValidationError("Email inválido")
          break

        case 2:
          this.$swal.showValidationError("RUT invalido: el formato es XXXXXXXX-X")
          break

        case 3:
          this.$swal.showValidationError("Ingresar al menos una dirección de envío")
          break

        case 4:
          this.$swal.showValidationError("Error en teléfono")
          break

        case 5:
          this.$swal.showValidationError("El formato de celular es: +569XXXXXXXX ")
      }
    },

    // Valida el rut con su cadena completa "XXXXXXXX-X"
    validaRut(rutCompleto) {
      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) {
        console.log("pero el rut anda mal ps")
        return false
      } else {
        var tmp = rutCompleto.split("-")
        var digv = tmp[1]
        var rut = tmp[0]
        console.log("el rut esta bueno, es: ", rut)
        if (digv == "K") digv = "k"
        return this.dv(rut) == digv
      }
    },

    dv: function(T) {
      var M = 0,
        S = 1
      for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - M++ % 6)) % 11
      return S ? S - 1 : "k"
    },

    // Valida campos obligatorios
    validarVacio(valor) {
      if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        console.log("esta vacio")
        return false
      } else {
        console.log("no esta vacio, el valor es: ", valor)
        return valor
      }
    },
    // Valida email
    validarEmail(valor) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(valor)) {
        console.log("pero el correo esta malo")
        return false
      } else {
        console.log("el correo esta bien, y es: ", valor)
        return valor
      }
    },
    // Valida telefono y celular
    validarPhone(valor) {
      if (/^\d{9}$/.test(valor)) {
        console.log("copiaron bien el numero ps", valor)
        return valor
      } else if (/^\+\d{2,3}\d{9}$/.test(valor)) {
        console.log("mira si, copiaron bien el número, hasta con el +56 ps, miralo:  ", valor)
        return valor
      } else {
        console.log("no copiaron bien el número")
        return false
      }
    },
    validations: function(email, rut, direccion) {
      if (this.validarVacio(email) && this.validarEmail(email)) {
        if (this.validarVacio(rut) && this.validaRut(rut)) {
          if (this.validarVacio(direccion)) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return false
      }
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
.modalForm
    display: flex
    align-items: center
    flex-direction: column
    .input_family, h2
      margin-bottom: 5px
    
span
   color: red

#first, #second, #third
  position: absolute
  right: 34px

#first
  top: 81px

#second
  top: 131px

#third
  top: 181px


</style>