<template>
  <div id="app">
    <div class="main">
      <div class="menu-icons">
          <a href="" alt="Escanear código de barra" title="Escanear código de barra"><img src="@/assets/barcode_scanner.png" alt=""> </a> 
          <a href="" alt="Introducir código" title="Introducir código"><img src="@/assets/manual.png" alt=""></a>  
      </div>
      <consulta></consulta>
    </div>
  </div>
</template>

<script>
import Consulta from "@/components/Consulta";

export default {
  components: {
    Consulta
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
