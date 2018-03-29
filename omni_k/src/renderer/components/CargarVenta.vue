<template>
<div class="container">
<!--     <form class="formulario" >
        <input type="text" name='codigoProducto' placeholder="Ingrese Número dee Boleta" > -->
        <button type="button" @click="connect()">Cargar</button>
<!-- </form> -->
<div class="datosComprador"></div>
 </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      errors: []
    };
  },

  methods: {}
};
</script>

<style >

</style>