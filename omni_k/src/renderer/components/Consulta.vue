<template>
    <div class="container">
        <form class="formulario" @submit.prevent="findProduct()">
            <input v-model="newDatos.sku" type="text" name='codigoProducto' class="inputs" placeholder=" Ingrese código de barra" >
            <button type="submit" class="btn-blue" >Buscar</button>
        </form>
        <div  v-if="submitted">
            <div v-if="errors && errors.length" class="aligned"> 
                <div v-for="error of errors">
                    <div class="warning" > {{error.message}} </div>
                </div>
            </div>
            <div v-else-if="datos.length === 0" class="aligned">
                <div class="warning" >Producto no encontrado.</div>
            </div>
            <div v-else class="table">
                <div class="table-row header">   
                    <div class="text th_element">SKU</div>
                    <div class="text th_element">Cantidad</div>
                </div>
                <div class="table-body">
                    <div class="table-row" v-for='dato in datos' >
                        <div class="text td_element">{{dato.sku}}</div>
                        <div class="text td_element">{{dato.cantidad}}</div>
                    </div>   
                </div>
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
          /*  if this.datos.sku.lenght  */
          this.datos = response.data;
        })
        .catch(e => {
          errors.length = 0;
          this.errors.push(e);
        });
      this.newDatos = {};
      this.submitted = true;
    }
  }
};
</script>

<style lang="sass">

.container
    display: flex
    flex: 1 1 auto
    flex-direction: column
           
.inputs
    border: $borders
    border-radius: 6px;
    padding: 5px

.btn-blue
    background-color: $second
    border-radius: 5px
    border: 2px solid $third
    color: $third
    padding: 5px
    &:hover
          cursor: pointer

.formulario
    display: flex;
    justify-content: center
    flex: 0 0 5%
    margin-top: 20px
    input
        margin-right: 40px
      
.aligned
    display: flex
    justify-content: center

.warning
    color: $fourth
    padding-top: 23px
    margin-top: 10px;

.table
     margin: 17px
     border: $table_borders
     border-radius: 4px;


.table-body
  overflow-y: scroll
  flex-direction: column
  height: auto
  max-height: 272px
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