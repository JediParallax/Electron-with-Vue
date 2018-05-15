<template>
   <div class="container">
    <form class="formulario" >
        <input type="text" v-model="numero_documento" name='codigoProducto' class="input_family"  placeholder="Ingrese número de boleta" >
        <button type="button"  class="btn_green inside_input" @click="loadSell()">Cargar</button>
    </form>
    <div v-if="submitted">
        <div v-if="errors && errors.length" class="aligned"> 
            <div v-for="error of errors">
                <div class="warning"> {{error.message}} </div>
            </div>
        </div> 
       <a class="right" @click="displayModal()">Ver datos de comprador</a>

    </div> 
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: "cargarVenta",
  data() {
    return {
      errors: [],
      submitted: false,
      numero_documento: ''
    };
  },

  methods: {
    loadSell() {
      this.submitted = false;
      //IMPRIMISMOS EN CONSOLA LA RESPUESTA RECIBIDA DESDE EL MAIN PROCEESS
      ipcRenderer.on('sendSale', (event, arg) => {
        console.log('respuesta recibida desde el main process',arg) // imprime "pong"
      })
      //ENVIAMOS EL NUMERO DE DOCUMENTO DE LA COMPRA, AL PROCESO PRINCIPAL PARA QUE BUSQUE EN LA BASE DE DATOS
      ipcRenderer.send('getSale', this.numero_documento)

      // ipcRenderer.removeAllListeners('sendSale')
      // ipcRenderer.removeAllListeners('getSale')
      
      

    },

    displayModal() {
      this.$swal({
        html: `
            <h2 id="innerModal">Datos de Comprador</h2>
            <section class="fields">
              <div>Nombre: Joan Manuel</div>
              <div>Apellido: Monterrey Flores</div>
              <div>Telefono: +56 931289778</div>
              <div>Correo: joanmonterrey@gmail.com </div>
              <div>Dirección: Av. Presidente balmaceda 2720</div>
            </section>
        `,
        showConfirmButton: false
      });
    }
  },
  // destroyer() {
  //   ipcRenderer.removeAllListeners();
  //   // ipcRenderer.removeAllListeners('getSale');
  // }

};
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

a.right 
    float: right
    padding-right: 7%
    padding-top: 6%

  
   
</style>