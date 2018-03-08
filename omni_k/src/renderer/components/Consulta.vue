<template>
    <div class="container">
    <form class="formulario" @submit.prevent="findBarcode()">
        <input v-model="datos.barcode" type="text" name='codigoProducto' placeholder=" Ingrese código de barra" >
        <button type="submit">Buscar</button>
    </form>
    <div class="table">
        <div class="table-row header">
            <div class="text th_element">SKU</div>
            <div class="text th_element">Barcode</div>
            <div class="text th_element">Color</div>
            <div class="text th_element">Precio</div>
        </div>
        <div class="table-body">
            <div class="table-row" v-for='dato in datos' >
            <div  class="text td_element">{{dato.sku}}</div>
            <div class="text td_element">{{dato.barcode}}</div>
            <div class="text td_element">{{dato.colors}}</div>
            <div class="text td_element">{{dato.precio}}</div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
export default {
  name: "consulta",
  data() {
    return {
      datos: [
        {
          sku: "0161651321",
          barcode: "816215164",
          colors: "azul",
          precio: "3000$"
        },
        {
          sku: "0161651322",
          barcode: "816248964",
          colors: "verde",
          precio: "7000$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        },
        {
          sku: "01616589251",
          barcode: "818975164",
          colors: "azul",
          precio: "4500$"
        },
        {
          sku: "0161651329",
          barcode: "816812644",
          colors: "morado",
          precio: "8642$"
        }
      ]
    };
  }
};
</script>

<style lang="sass">

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