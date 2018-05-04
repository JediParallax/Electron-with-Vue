<template>
  <div id="app">
    <div class="main">
      <div class="menu-icons">
        <div class="icons_left">
          <router-link to="/"><img id="first_icon" class="icon_image" src="@/assets/barcode_scanner.png" alt="Consultar Stock" title="Consultar Stock"></router-link>
          <router-link to="/CargarVenta"><img class="icon_image" src="@/assets/load.png" alt="Cargar Venta Omni" title="Cargar Venta Omni"></router-link>
        </div>
        <div class="icons_right">
          <router-link to="/Configuracion"><img class="icon_image" src="@/assets/settings.png" alt="Configuración" title="Configuración"></router-link>
        </div>
      </div>
      <router-view></router-view> 
    </div>
  </div>
</template>

<script>
import Consulta from "@/components/Consulta"
import CargarVenta from "@/components/CargarVenta"
import Configuracion from "@/components/Configuracion"

export default {
  components: {
    Consulta,
    CargarVenta,
    Configuracion
  },
  name: "omni_k",

  data() {
    return {}
  }
}
</script>

<style lang="sass">

@import "./assets/sass/_reset"
@import url('https://fonts.googleapis.com/css?family=Dosis')

html
  width: 100%
  height: 100%
  overflow: hidden
  font-size: 19px
  color: $blue
  font-family: Dosis, Microsoft Sans serif

+links($blue,$alt_white,$green,$green_hover)
  
.main
  display: flex
  flex-direction: column 
  height: 100%
  
.menu-icons
    background-color: $blue
    display: flex
    flex-direction: row

    .icons_left
      @extend %icons_properties
      justify-content: flex-start
      margin-left: 10px
      img
         margin: 10px 0 10px 8px

    .icons_right
      @extend %icons_properties
      justify-content: flex-end
      margin-right: 10px
      img
        margin: 10px 8px 10px 0px;
    
.icon_image
    width: 42px
    height: auto
    transition: all 1s ease-in-out
    &:hover
        transform: rotate(180deg);

#first_icon
  transition: all .2s ease-in-out
  &:hover 
    transform: rotate(20deg)

.input_family
    width: 90%
    height: 50px
    padding: 6px 12px
    border: 1px solid #ccc
    font-size: 15px
    font-weight: 700
    font-family: Dosis, Microsoft Sans serif
    font-size: 19px
    color: $blue
    border-radius: 38px;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075)
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out
    caret-color: $green
    &:focus
      border-color: $green
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);

.btn_green
    @extend %btn
    +btn_color($green)
    &:hover
      +btn_hover($green_hover)

.btn_green_border
    @extend %btn
    +btn_outlined($green) 
    &:hover
      +btn_hover($green_hover)
  
.inside_input
    position: absolute
    top: 85px
    right: 20px

</style>
