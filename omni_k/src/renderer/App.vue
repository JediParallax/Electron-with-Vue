<template>
  <div id="app">
    <div class="main">
      <div class="menu-icons">
        <div class="icons_left">
          <router-link to="/" ><img id="first_icon" class="icon_image" src="@/assets/barcode_scanner.png" alt="Consultar Stock" title="Consultar Stock"></router-link>
          <router-link to="/CargarVenta" ><img class="icon_image" src="@/assets/load.png" alt="Cargar Venta Omni" title="Cargar Venta Omni"></router-link>
        </div>
        <div class="icons_right">
          <router-link to="/Configuracion" ><img   :class="[isActive ? 'pulse' : '', 'icon_image']"  src="@/assets/settings.png" alt="Configuración" title="Configuración"></router-link>
        </div>
      </div>
      <transition name="component-fade" mode="out-in">
      <router-view></router-view> 
      </transition>
    </div>
  </div>
</template>

<script>
import Consulta from "@/components/Consulta";
import CargarVenta from "@/components/CargarVenta";
import Configuracion from "@/components/Configuracion";
import { ipcRenderer } from "electron";
export default {
  components: {
    Consulta,
    CargarVenta,
    Configuracion
  },
  name: "omni_k",
  data() {
    return {
      isActive: false
    };
  },

  //Si la base de datos esta vacía, agrega una animación en el icono de Configuración
  created() {
    ipcRenderer.send("modal");
    ipcRenderer.on("warningDB", (event, arg) => {
      if (arg === null) {
       this.isActive = true
      }
    ipcRenderer.removeAllListeners("modal");
    ipcRenderer.removeAllListeners("warningDB");
    });
  },

};
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
    @extend %inputBasis
    border: 1px solid #ccc
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075)
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out
    &:focus
      border: 1px solid $green
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);

.inputError
  @extend %inputBasis
  border: 1px solid $error
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
.btn_blue_border
    @extend %btn
    +btn_outlined($blue) 
    &:hover
      +btn_hover($blue)
.btn_orange
    @extend %btn
    +btn_color($orange)
    &:hover
      +btn_hover($orange_hover)
.btn_in_swal
  margin: 0 .3125em
  padding: .625em 2em
  
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
  
.bigger
  flex: 3 !important
.medium
  flex: 2 !important
  
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
            
.cifra
    font-weight: bold        
    color: $green
h2.innerModal
    margin-bottom: 33px;
  
.fields
  display: flex
  flex-flow: wrap column
  align-items: flex-start
  div
    padding: 7px
    white-space: nowrap

.modal_links
    display: flex;
    justify-content: space-around
    margin-top: 6%   

.loader
    width: 125px;
    position: relative;
    left: 164px;
    top: 107px;

@keyframes radial-pulse 
  0% 
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.5);

  100% 
    box-shadow: 0 0 0 30px rgba(0, 0, 0, 0);
  
.pulse
  animation: radial-pulse 1.5s infinite;
  border-radius: 100%
    
</style>