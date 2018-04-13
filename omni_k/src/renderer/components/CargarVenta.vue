<template>
   <div class="container">
    <form class="formulario" >
        <input type="text" name='codigoProducto' class="input_family"  placeholder="Ingrese número de boleta" >
        <button type="button"  class="btn_green inside_input" @click="loadSell()">Cargar</button>
    </form>
    <div v-if="submitted">
        <div v-if="errors && errors.length" class="aligned"> 
            <div v-for="error of errors">
                <div class="warning"> {{error.message}} </div>
            </div>
        </div> 
       <button class="btn-blue aligned"  @click="displayModal()">Datos de Usuario</button>
    </div> 
  </div>
</template>

<script>
export default {
  name: "cargarVenta",
  data() {
    return {
      errors: [],
      submitted: false
    };
  },

  methods: {
    loadSell() {
      this.submitted = true;
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
        showConfirmButton: false,
        background: "#BDE4F4"
      });
    }
  }
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
   
</style>