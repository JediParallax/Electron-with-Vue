<template>
    <div class="container">
        <form class="formulario" @submit.prevent="findProduct()">
            <input v-model="newDatos.sku" type="text" name='codigoProducto' placeholder=" Ingrese código de barra" >
            <button type="submit">Buscar</button>
        </form>
        <div class="table" v-if="submitted">
            <div class="table-row header">   
                <div class="text th_element">SKU</div>
                <div class="text th_element">Cantidad</div>
            </div>
            <div class="table-body">
                <div v-if="datos.length > 0">
                    <div class="table-row" v-for='dato in datos' >
                        <div class="text td_element">{{dato.sku}}</div>
                        <div class="text td_element">{{dato.cantidad}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="errors && errors.length"> 
            <div v-for="error of errors">
                    {{error.message}}
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "consulta",
  data() {
    return {
      datos: [],
      errors: [],
      newDatos: {},
      submitted: false
    };
  },
  methods: {
    findProduct() {
      axios
        .get(`http://200.14.252.14:3000/stockBodega/${this.newDatos.sku}`)
        .then(response => {
          this.datos = response.data;
        })
        .catch(e => {
          this.errors.push(e);
        });
      /*  this.datos.push(this.newDatos); */
      this.newDatos = {};
      this.submitted = true;
    }
  }
};
</script>

<style scoped lang="sass">

.container
    display: flex
    flex: 1 0 auto
    flex-direction: column
           
.formulario
    display: flex;
    justify-content: space-around
    flex: 0 0 5%
    margin: 20px
 
    input   
        border: $borders
        padding: 5px
      
    button 
        background-color: $second
        border-radius: 5px
        border: 2px solid $third
        color: $third
        padding: 5px
        &:hover
          cursor: pointer

.table
    flex: 1 0 auto
    display: flex
    flex-direction: column
    margin: 0 20px 20px 20px
    height: 400px

.table-body
  overflow-y: scroll
  flex-direction: column
  height: 240px
  border: $table_borders
  border-top: 0

.table-row
  display: flex       
  flex-direction: row               
  flex-wrap: nowrap        
  width: 100%
  
.header 
    background-color: $second
    font-weight: bold
    overflow-y: scroll
    border: $table_borders
    border-bottom: 0
    .th_element
         padding: 7px 0
         
.text 
  display: flex    
  overflow: hidden
  border: $alt_borders
  justify-content: center
  flex: 1 0 110px

.td_element
   padding: 2.6px 0
   
</style>