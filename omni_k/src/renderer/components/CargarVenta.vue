<template>
   <div class="container">
    <form class="formulario" >
        <input type="text" name='codigoProducto' class="input_family"  placeholder="Ingrese número de boleta" >
        <button type="submit"  class="btn_green inside_input" @submit.prevent="loadSale()">Cargar</button>
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
       </div>ñ
    </div> 
  </div>
</template>

<script>
export default {
  name: "cargarVenta",
  data() {
    return {
      userData: [
        {
          nombre: "Joan Manuel",
          lastName: "Monterrey Flores",
          phone: "+56 931289778",
          email: "joanmonterrey@gmail.com",
          address: "Av. Presidente balmaceda 2720",
          comuna: "Quinta Normal",
          ciudad: "Santiago",
          birthdate: "16/03/1993",
          signdate: "01/15/2018",
          address2: ""
        },
        {
          numero: "2j23230i",
          tipo: "tipo_doc",
          fecha: "15/05/2018",
          hora: "3:00pm",
          codigo_tienda: "239488324"
        },
        {
          codigo_producto: "jodq90d21",
          cantidad: "35",
          precio_total: "$10000"
        }
      ],
      errors: [],
      submitted: false
    }
  },

  methods: {
    loadSale() {
      this.submitted = true
    },

    datosComprador() {
      this.$swal({
        html: `
            <h2 id="innerModal">Datos de Comprador</h2>
            <section class="fields">
              <div>Nombre: ${this.userData[0].nombre}</div>
              <div>Apellido: ${this.userData[0].lastName}</div>
              <div>Telefono: ${this.userData[0].phone}</div>
              <div>Correo: ${this.userData[0].email} </div>
              <div>Dirección: ${this.userData[0].address}</div>
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
              <div>Número de Doc: ${this.userData[1].numero}</div>
              <div>Tipo de Doc: ${this.userData[1].tipo}</div>
              <div>Fecha de Doc: ${this.userData[1].fecha}</div>
              <div>Hora de Doc: ${this.userData[1].hora} </div>
              <div>Codigo de Tienda: ${this.userData[1].codigo_tienda}</div>
            </section>
        `,
        showConfirmButton: false
      })
    }
  }
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