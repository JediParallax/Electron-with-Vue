import Vue from "vue";
import Router from "vue-router";
import Consulta from "@/components/Consulta";
import CargarVenta from "@/components/CargarVenta";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Consulta",
      component: Consulta
    },
    {
      path: "/CargarVenta",
      name: "CargarVenta",
      component: CargarVenta
      /*  redirect: "/" */
    }
  ]
});
