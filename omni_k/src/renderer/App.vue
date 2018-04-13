<template>
  <div id="app">
    <div class="main">
      <div class="menu-icons">
        <div class="icons_right">
          <router-link to="/"><img src="@/assets/barcode_scanner.png" alt="Consultar Stock" title="Consultar Stock"></router-link>
          <router-link to="/CargarVenta"><img src="@/assets/load.png" alt="Cargar Venta Omni" title="Cargar Venta Omni"></router-link>
        </div>
        <div class="icons_left">
          <router-link to="/Configuracion"><img src="@/assets/settings.png" alt="Configuración" title="Configuración"></router-link>
        </div>
      </div>
      <router-view></router-view> 
    </div>
  </div>
</template>

<script>
import Consulta from "@/components/Consulta";
import CargarVenta from "@/components/CargarVenta";
import Configuracion from "@/components/Configuracion";

export default {
  components: {
    Consulta,
    CargarVenta,
    Configuracion
  },
  name: "omni_k",

  data() {
    return {};
  }
};
</script>

<style lang="sass">

*, *:after, *:before
  box-sizing: border-box
  margin: 0
  padding: 0

#app, body, html
  width: 100%
  height: 100%
  overflow: hidden
  font-family: Dosis, sans-serif
  font-size: 19px
  color: $blue


input, textarea, select
  &:focus
    outline-offset: 0
    outline: 0

a
  text-decoration: none
  color: $alt_white

.main
  display: flex
  flex-direction: column 
  height: 100%
  
.menu-icons
    background-color: $blue
    display: flex
    flex-direction: row
    .icons_right
      display: flex
      flex-direction: row
      flex: 1 1 auto
      justify-content: flex-start
      margin-left: 10px;
    .icons_left
       display: flex
       flex-direction: row
       flex: 1 1 auto
       justify-content: flex-end
       margin-right: 10px
       img
            margin: 10px 8px 10px 0px;
    img
        width: 42px
        height: auto
        margin: 10px 0 10px 8px
        transition: all .1s ease-in-out
        &:hover
          transform: scale(1.1)
    
          
.input_family
    width: 90%
    height: 50px
    padding: 6px 12px
    border: 1px solid #ccc
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075)
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out
    font-size: 15px
    font-weight: 700
    border-radius: 38px;
    font-family: Dosis, sans-serif
    font-size: 19px
    color: $blue

.btn_green
    font-family: Dosis, sans-serif
    color: #fff
    background-color: $green
    border-color: $green
    height: 51px
    border-radius: 38px
    font-weight: 700
    padding-left: 27px
    padding-right: 27px
    border: 1px solid transparent
    text-transform: uppercase
    &:hover
        background-color: $green_hover
        border-color: $green_hover
        cursor: pointer

.inside_input
    position: absolute
    top: 85px
    right: 22px



        
</style>
