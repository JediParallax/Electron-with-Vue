<template>
  <div id="app">
    <div class="main">
      <div class="menu-icons">
        <router-link to="/"><img src="@/assets/barcode_scanner.png" alt=""></router-link>
        <router-link to="/CargarVenta"><img src="@/assets/manual.png" alt=""></router-link>
          <!-- <a href="" alt="Escanear código de barra" title="Escanear código de barra"><img src="@/assets/barcode_scanner.png" alt=""> </a> 
          <a href="" alt="Introducir código" title="Introducir código"><img src="@/assets/manual.png" alt=""></a>   -->
      </div>
      <router-view></router-view> 
    </div>
  </div>
</template>

<script>
import Consulta from "@/components/Consulta";
import CargarVenta from "@/components/CargarVenta";

export default {
  components: {
    Consulta,
    CargarVenta
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
    justify-content: flex-start
    flex: 0 0 13%
    img
        width: 42px
        height: auto
        margin: 10px 0 10px 8px
        
</style>
