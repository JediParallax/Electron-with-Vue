<template>
  <div id="app">
    <div class="main">
      <div class="menu-icons">
        <div class="icons_left">
          <router-link to="/" ><img id="first_icon" class="icon_image" src="@/assets/barcode_scanner.png" alt="Consultar Stock" title="Consultar Stock"></router-link>
          <router-link to="/CargarVenta" ><img class="icon_image" src="@/assets/load.png" alt="Cargar Venta Omni" title="Cargar Venta Omni"></router-link>
        </div>
        <div class="icons_right">
          <router-link to="/Configuracion"><img class="icon_image" src="@/assets/settings.png" alt="Configuración" title="Configuración"></router-link>
        </div>
      </div>
      <transition name="component-fade" mode="out-in">
      <router-view></router-view> 
      </transition>
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

@import url('https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css')
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

.title
    text-align: center;
    padding-top: 8px;

.container
    display: flex
    flex: 1 1 auto
    flex-direction: column
           
.formulario
    display: flex;
    justify-content: center
    flex: 0 0 5%
    margin-top: 20px

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
      
.aligned
    display: flex
    flex-direction: column;
    align-items: center;

.warning
    color: $orange
    padding: 10px;
    margin-top: 20px;

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
  
.inside_input
    position: absolute
    top: 130px
    right: 20px

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
  
label 
  padding-bottom: 5px

.component-fade-enter-active, .component-fade-leave-active
  transition: opacity .3s ease

.component-fade-enter, .component-fade-leave-to
  opacity: 0

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
    flex: 1
    
.td_element
    padding: 2.6px 0
    font-size: 17px
        
.highlight
    background: $blue
    color: $white

.precios
    text-align: end
    margin: 0 10%
    p
       margin-bottom: 3px
       span
           font-weight: bold        
           color: $green
        


</style>
