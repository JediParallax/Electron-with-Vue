<template>
    <div class="container">
         <h2 class="title">Consultar Stock</h2>
        <form class="formulario" @submit.prevent="findProduct()">
            <input v-model="newDatos.sku" type="text" name='codigoProducto' class="input_family" placeholder=" Ingrese código de barra" >
            <button type="submit" class="btn_green inside_input" >Buscar</button>
        </form>
        <div v-show="result">
            <div class="table">
                <div class="table-row header">   
                    <div class="text th_element">SKU</div>
                    <div class="text th_element">Cantidad</div>
                </div>
                <div class="table-body" id="consultaTableSize">
                    <div class="table-row" v-for='dato in datos' :class="newDatos.sku == dato.barcode ? 'highlight' : '' ">     
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
        <div class="aligned" v-show="notFoundMessage">
            <div class='warning'>Producto no encontrado.</div>
        </div>
        <div v-if="this.errors.length > 0">
            <div v-for="error of errors" class="warning aligned">
                <p>Se ha encontrado el siguiente error:</p>   
                <p>{{error.message}}</p> 
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"

export default {
  name: "consulta",
  data() {
    return {
      datos: [],
      errors: [],
      newDatos: {},
      result: false,
      notFoundMessage: false,
      price_detail: "",
      price_promotion: ""
    }
  },
  methods: {
    findProduct() {
      axios
        .get(`http://200.14.252.14:3000/stockBodega/${this.newDatos.sku}`)
        .then(response => {
          this.datos = response.data

          if (this.datos.length > 0) {
            this.notFoundMessage = false
            this.isError = false
            this.result = true
            this.price_detail = parseInt(this.datos[0].precio_detalle).toLocaleString()
            this.price_promotion = parseInt(this.datos[0].precio_promotora).toLocaleString()
            this.errors.length = 0
          } else {
            this.result = false
            this.notFoundMessage = true
            this.isError = false
            this.errors.length = 0
          }
          h
        })
        .catch(e => {
          this.errors.length = 0
          this.errors.push(e)
        })
    }
  }
}
</script>

<style lang="sass">

#consultaTableSize
    max-height: 220px

</style>