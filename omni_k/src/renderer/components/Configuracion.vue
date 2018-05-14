<template>
  <div class="container">
    <h2 class="title">Configuración</h2>
    <div class="config_form" >
      <label>Elija una Bases de Datos: </label>
      <select id="select_dbs" class="input_family"></select>
    </div>
  </div>
</template>

<script>
export default {
  name: "configuracion",
  data() {
    return {}
  }
}
</script>

<style lang="sass">

  .config_form
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

</style>