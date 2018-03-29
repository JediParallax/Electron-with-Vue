<template>
  <div id="app">
    <div class="main">
      <div class="menu-icons">
        <div class="icons_right">
          <router-link to="/"><img src="@/assets/barcode_scanner.png" alt="Consultar Stock" title="Consultar Stock"></router-link>
          <router-link to="/CargarVenta"><img src="@/assets/manual.png" alt="Cargar Venta Omni" title="Cargar Venta Omni"></router-link>
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
  font-family: helvetica

a
  text-decoration: none
  color: $fourth

.main
  display: flex
  flex-direction: column 
  background-color: $first
  height: 100%

.menu-icons
    background-color: $second
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

        
</style>
