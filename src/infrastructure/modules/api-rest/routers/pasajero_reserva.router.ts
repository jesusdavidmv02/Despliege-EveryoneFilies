import express from "express";
import { PasajeroReservaController } from '../../../../application/pasajero_reserva.controller';

export const PasajeroReservaRouter = () => {
    const router = express.Router()

    const pasajeroCtrl = new PasajeroReservaController();

  router.post("/pasajero_reserva", (req, res) => {
    // Capturando el body que el cliente envia en la solitud
    const payload = req.body;
    // Resolver la promesa con then-catch del controlador
    pasajeroCtrl
      .agregar(payload)
      .then((result) => {
        
        // const status = result.ok === true ? 200 : 400;
        // res.status(status).send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

  router.get("/pasajero_reserva", (req, res) => {
    const id = req.query.id
    pasajeroCtrl
      .obtenerPorId(Number(id))
      .then((result) => {
        const status = result.ok === true ? 200 : 404;
        res.status(status).send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

  router.get("/pasajeros", (req, res) => {
    pasajeroCtrl
      .obtener()
      .then((result) => {
        const status = result.ok === true ? 200 : 400;
        res.status(status).send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });





  return router
}