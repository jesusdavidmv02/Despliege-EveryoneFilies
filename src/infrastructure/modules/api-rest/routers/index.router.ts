import Express from "express";
import { PasajeroRouter } from "./pasajero.router";
import { RutasReserva } from "./reserva.router";
import { RutasTicket } from "./tickets.router";
import { RutasVuelo } from "./vuelos.router";
import { RutasAsiento } from "./asientos.router";
import { RutasCategoria } from "./categorias.router";
import { RutasPreciosTemporales } from "./precios_temporales.router";
import { RutasSeleccionarCategoria } from "./seleccionar_categoria.router";

export const routes = () => {
  const router = Express.Router();
  router.get("/", (req, res) => {
    res.send({ message: "Bienvenido a la API " });
  });
  
  router.use(PasajeroRouter());
  router.use(RutasReserva());
  router.use(RutasTicket());
  router.use(RutasVuelo());
  router.use(RutasAsiento());
  router.use(RutasCategoria());
  router.use(RutasPreciosTemporales());
  router.use(RutasSeleccionarCategoria());

  return router;
};