<template>
    <div class="container">
        <form class="formulario" @submit.prevent="findProduct()">
            <input v-model="newDatos.sku" type="text" name='codigoProducto' class="input_family" placeholder=" Ingrese código de barra" >
            <button type="submit" class="btn_green inside_input" >Buscar</button>
        </form>
        <div v-if="submitted">
            <div v-if="datos.length == 0" class="aligned">
                <div class="warning" >Producto no encontrado</div>
            </div>
            <div v-else>
                <div class="table">
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
                <div class="precios">
                    <p>Precio Detalle: <span>$ {{price_detail}}</span></p>
                    <p>Precio Promotora: <span>$ {{price_promotion}}</span></p> 
                </div>
            </div>
            <div v-if="errors && errors.length" class="aligned"> 
                <div v-for="error of errors">
                    <div class="warning" > {{error.message}} </div>
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
      submitted: false,
      price_detail: "",
      price_promotion: ""
    };
  },
  methods: {
    findProduct() {
      axios
        .get(`http://200.14.252.14:3000/stockBodega/${this.newDatos.sku}`)
        .then(response => {
          this.datos = response.data;
          if (this.datos.length > 0) {
            this.price_detail = this.datos[0].precio_detalle;
            this.price_promotion = this.datos[0].precio_promotora;
            this.price_detail = parseInt(this.price_detail).toLocaleString();
            this.price_promotion = parseInt(
              this.price_promotion
            ).toLocaleString();
          }
        })
        .catch(e => {
          this.errors.length = 0;
          this.errors.push(e);
        });
      this.newDatos = {};
      this.submitted = true;
      /*this.price_detail = "$ " + this.datos[0].precio_detalle;
        this.price_promotion = "$ " + this.datos[0].precio_promotora;
        console.log(this.price_detail, this.price_promotion);  */
    }
  }
};
</script>

<style lang="sass">

.container
    display: flex
    flex: 1 1 auto
    flex-direction: column
           
.formulario
    display: flex;
    justify-content: center
    flex: 0 0 5%
    margin-top: 20px
      
.aligned
    display: flex
    justify-content: center

.warning
    color:#fff
    background-color: #fff
    border-radius: 6px;
    padding: 10px;
    margin-top: 20px;

.table
    margin: 17px
    transition: all .2s ease-out
    border: $table_border
    box-shadow: 0 2px 43px -4px rgba(0,0,0,.19)
    &:hover
        transform: translateY(2px);
        box-shadow: 0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05)

.table-body
    height: auto
    max-height: 185px;
    border-top: 0
    overflow-y: scroll

.table-row
    display: flex         
    width: 100%
  
.header 
    background-color: $white
    font-weight: bold
    border-bottom: 0
    overflow-y: scroll
    .th_element
        padding: 7px 0
        font-weight: bolder;
        font-size: 18px;
         
.text 
    display: flex    
    overflow: hidden
    border: $table_border
    justify-content: center
    flex: 1 0 110px
    
.td_element
    padding: 2.6px 0
    font-size: 17px

.precios
    float: right
    margin: 0 9%
    p
       margin-bottom: 3px
       span
           font-weight: bold        
           color: $green
</style>