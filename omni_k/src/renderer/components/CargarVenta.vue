<template>
   <div class="container">
       <h2 class="title">Cargar Venta</h2>
    <form class="formulario"  @submit.prevent="loadSale()" >
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
          <button @click ="inputFields()" class="btn_blue_border">Hacer Pedido Express</button>
          <p>Precio total: <span class="cifra">$ {{total_price}}</span></p>
       </div>
    </div>
     <div class="aligned" v-show="notFoundMessage">
        <div class='warning'>Boleta no encontrada.</div>
     </div>
     <div v-show="isError">
         <div v-for="error of errors" class="warning aligned">
            <p>Se ha encontrado el siguiente error:</p>   
            <p>{{error.name}}</p> 
         </div>
     </div>
    
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import axios from "axios";

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
      saleUpdate: {},
      total_price: "",
      url: "http://200.14.252.14:3001/omni_prueba/VentaOmni/"
    };
  },
  // si la base de datos no esta establecida, advierte con una ventana modal
  created() {
    ipcRenderer.send("modal");
    ipcRenderer.on("warningDB", (event, arg) => {
      if (arg === null) {
        this.$swal({
          type: "warning",
          title: "Seleccione base de datos",
          showConfirmButton: false
        });
      }
    });
  },
  methods: {
    loadSale() {
      //INICIALMENTE ELIMINAMOS LOS RENDERER_PROCESS OYENTES que envian el numero de documento al MAIN_PROCESS
      ipcRenderer.removeAllListeners("sendSale");
      ipcRenderer.removeAllListeners("getSale");
      //ENVIAMOS EL NUMERO DE DOCUMENTO DE LA COMPRA, AL PROCESO PRINCIPAL PARA QUE BUSQUE EN LA BASE DE DATOS
      ipcRenderer.send("getSale", this.numero_documento);

      //IMPRIMISMOS EN CONSOLA LA RESPUESTA RECIBIDA DESDE EL MAIN PROCEESS
      ipcRenderer.on("sendSale", (event, arg) => {
        console.log("DATOS ENVIADOS DESDE EL MAIN PROCESS: ", arg); //ONLY DEPURATION
        this.sale = arg;
        if (this.sale.skus && !this.sale.error) {
          this.errors.length = 0;
          this.notFoundMessage = false;
          this.isError = false;
          this.total_price = parseInt(
            this.sale.documento.precio_total
          ).toLocaleString();
          this.result = true;
        } else if (this.sale.error.number) {
          this.notFoundMessage = false;
          this.result = false;
          this.errors.length = 0;
          this.errors.push(this.sale.error);
          this.isError = true;
        } else {
          this.errors.length = 0;
          this.isError = false;
          this.result = false;
          this.notFoundMessage = true;
        }
        this.numero_documento = "";
      });
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
            });
            console.log(response);
            this.result = false;
          }
        })
        .catch(e => {
          this.$swal({
            type: "error",
            title: "Error al enviar pedido",
            showConfirmButton: false
          });
          this.$swal.showValidationError(e);
        });
    },
    saleSendManager() {
      if (this.sale.cliente.codigo == this.sale.tienda.codigo) {
        this.$swal({
          type: "error",
          title: "Error en Punto de Venta",
          text: "Anule la boleta e ingrese los datos del cliente correctamente",
          showConfirmButton: false
        });
        this.$swal.showValidationError("RUT inválido en punto de venta");
      } else {
        this.completeSale();
      }
    },
    preSend() {
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
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(result => {
        if (result.value) {
          this.saleSendManager();
        } else {
          this.inputFields();
        }
      });
    },
    datosComprador() {
      this.$swal({
        html: `
            <h2 class="innerModal">Datos de Comprador</h2>
            <section class="fields">
              <div class="longName">Nombre: ${
                this.sale.cliente.nombre
              }</div>       
              <div>RUT: ${this.sale.cliente.rut}</div>
              <div>Telefono: ${this.sale.cliente.celular}</div>
              <div>Correo: ${this.sale.cliente.email} </div>
              <div>Dirección: ${this.sale.cliente.direccion}</div>
            </section>
        `,
        showConfirmButton: false
      });
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
      });
    },
    inputFields: async function() {
      let flag = 0;
      const { value: formValues } = await this.$swal({
        title: "Verifique datos del cliente",
        html: `<form class="modalForm">
          <input class="input_family" name="email" type="email" id="swal_email" placeholder="email" required value=${
            this.sale.cliente.email
          } > 
          <span id="first">*</span>
          <input class="input_family" name="rut" type="text" placeholder="RUT" id="swal_RUT" value=${
            this.sale.cliente.rut
          } required />
          <span id="second">*</span>
          <input class="input_family" name="direccion" type="text" placeholder="Dirección" id="swal_direccion" value=${
            this.sale.cliente.direccion
          } required />
          <span id="third">*</span>
          <input class="input_family" name="direccion_al" type="text" placeholder="Dirección Alternativa" id="swal_alt_direccion" />
          <input class="input_family" name="telefono" type="tel" placeholder="Teléfono" id="swal_telefono" value=${
            this.sale.cliente.telefono
          } >
          <input class="input_family" name="celular" type="tel" placeholder="Celular" id="swal_celular" value=${
            this.sale.cliente.celular
          } >
          </form> `,
        focusConfirm: false,
        buttonsStyling: false,
        showConfirmButton: true,
        confirmButtonText: "Enviar",
        confirmButtonClass: "btn_blue_border",
        showCloseButton: true,
        showLoaderOnConfirm: true,
        focusConfirm: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer:
          "<span>*</span>" + " Email, RUT y Dirección son campos obligatorios",
        preConfirm: () => {
          var email = document.getElementById("swal_email");
          if (
            this.validarVacio(email.value) &&
            this.validarEmail(email.value)
          ) {
            this.saleUpdate.email = email.value;
            console.log(this.sale);
            email.className = "input_family";
          } else {
            flag = 1;
            this.alertValidaciones(flag);
            email.className = "inputError";
          }

          let RUT = document.getElementById("swal_RUT");
          if (this.validarVacio(RUT.value) && this.validaRut(RUT.value)) {
            this.saleUpdate.rut = RUT.value;
            RUT.className = "input_family";
          } else {
            flag = 2;
            this.alertValidaciones(flag);
            RUT.className = "inputError";
          }

          let address = document.getElementById("swal_direccion");
          let alt_address = document.getElementById("swal_alt_direccion").value;
          if (this.validarVacio(address.value)) {
            this.saleUpdate.direccion = address.value;
            this.sale.update.address_alt = alt_address;
            address.className = "input_family";
            console.log(address.value, alt_address);
          } else {
            flag = 3;
            this.alertValidaciones(flag);
            address.className = "inputError";
          }

          let phone = document.getElementById("swal_telefono");
          console.log(phone.value);
          if (
            phone.value == null ||
            phone.value.length == 0 ||
            /^\s+$/.test(phone.value)
          ) {
            flag = 0;
            phone.className = "input_family";
          } else if (this.validarPhone(phone.value)) {
            this.saleUpdate.telefono = phone.value;
            phone.className = "input_family";
          } else {
            flag = 4;
            this.alertValidaciones(flag);
            phone.className = "inputError";
          }

          let cellphone = document.getElementById("swal_celular");
          if (
            cellphone.value == null ||
            cellphone.value.length == 0 ||
            /^\s+$/.test(cellphone.value)
          ) {
            flag = 0;
            cellphone.className = "input_family";
          } else if (this.validarPhone(cellphone.value)) {
            this.saleUpdate.celular = cellphone.value;
            cellphone.className = "input_family";
          } else {
            flag = 5;
            this.alertValidaciones(flag);
            cellphone.className = "inputError";
          }
        }
      });
      if (formValues) {
        this.sale.update = this.saleUpdate;
        this.preSend();
      }
    },

    //*********************************VALIDACIONES********************************//
    alertValidaciones(x) {
      switch (x) {
        case 1:
          this.$swal.showValidationError("Email inválido");
          break;

        case 2:
          this.$swal.showValidationError(
            "RUT invalido: el formato es XXXXXXXX-X"
          );
          break;

        case 3:
          this.$swal.showValidationError("Ingrese dirección de envío");
          break;

        case 4:
          this.$swal.showValidationError("Error en teléfono");
          break;

        case 5:
          this.$swal.showValidationError(
            "El formato de celular es: +569XXXXXXXX "
          );
      }
    },

    // Valida el rut con su cadena completa "XXXXXXXX-X"
    validaRut(rutCompleto) {
      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) {
        console.log("pero el rut anda mal ps");
        return false;
      } else {
        var tmp = rutCompleto.split("-");
        var digv = tmp[1];
        var rut = tmp[0];
        console.log("el rut esta bueno, es: ", rut);
        if (digv == "K") digv = "k";
        return this.dv(rut) == digv;
      }
    },

    dv: function(T) {
      var M = 0,
        S = 1;
      for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - M++ % 6)) % 11;
      return S ? S - 1 : "k";
    },

    // Valida campos obligatorios
    validarVacio(valor) {
      if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        console.log("esta vacio");
        return false;
      } else {
        console.log("no esta vacio, el valor es: ", valor);
        return valor;
      }
    },
    // Valida email
    validarEmail(valor) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(valor)) {
        console.log("pero el correo esta malo");
        return false;
      } else {
        console.log("el correo esta bien, y es: ", valor);
        return valor;
      }
    },
    // Valida telefono y celular
    validarPhone(valor) {
      if (/^\d{9}$/.test(valor)) {
        console.log("copiaron bien el numero ps", valor);
        return valor;
      } else if (/^\+\d{2,3}\d{9}$/.test(valor)) {
        console.log(
          "mira si, copiaron bien el número, hasta con el +56 ps, miralo:  ",
          valor
        );
        return valor;
      } else {
        console.log("no copiaron bien el número");
        return false;
      }
    }
  }
};
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
    input, h2
      margin-bottom: 5px
    
span
   color: red

#first, #second, #third
  position: absolute
  right: 33px

#first
  top: $top

#second
  top: calc(50px + #{$top})

#third
  top: calc(100px + #{$top})

</style>