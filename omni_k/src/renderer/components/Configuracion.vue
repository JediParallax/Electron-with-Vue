<template>
  <div class="config_form" >
    <label>Elija una Bases de Datos: </label>
    <select id="select_dbs" class="input_family"></select>
  </div>
</template>

<script>
import localDBconfig from "@/globals/localDBconfig.js";
export default {
  name: "configuracion",
  components: { localDBconfig },
  data() {
    return {};
  },

  created() {
    const { getDatabases } = require("@/globals/localDBconfig.js");
    let options = "<option></option>";
    getDatabases.getDatabases("esto tiene que pasarse al modulo").then(data => {
      data.forEach(element => {
        options += "<option>" + element.name + "</option>";
      });
      document.getElementById("select_dbs").innerHTML = options;
    });
  }
};
</script>

<style lang="sass">
  .config_form
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
</style>