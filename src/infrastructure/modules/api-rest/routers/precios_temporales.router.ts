import Express from "express";
import { PreciosTemporalesController } from "../../../../application/precios_temporales.controller";

export const RutasPreciosTemporales = () => {

  const router = Express.Router();
  const preciosTemporalesCtrl = new PreciosTemporalesController();

  
  router.get("/precios-temporales", (req, res) => {
    preciosTemporalesCtrl.obtener().then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send("Error al obtener los precios temporales: " + error);
    });
  });

  
  router.post("/precios-temporales", (req, res) => {
    const payload = req.body;
    preciosTemporalesCtrl.agregar(payload).then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send("Error al agregar el precio temporal: " + error);
    });
  });

  
  router.put("/precios-temporales", (req, res) => {
    const payload = req.body;
    preciosTemporalesCtrl.actualizar(payload).then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send("Error al actualizar el precio temporal: " + error);
    });
  });

  
  router.get("/precios-temporales/:id", async (req, res) => {
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado. Debe ser un número válido." });
        return;
      }
      const result = await preciosTemporalesCtrl.obtenerPorId(id);
      if (result != null) {
        res.send({ result });
      } else {
        res.status(404).send({ ok: false, message: "El precio temporal no fue encontrado." });
      }
    } catch (error) {
      res.status(500).send("Error al obtener el precio temporal: " + error);
    }
  });

  
  router.delete("/precios-temporales/:id", async (req, res) => {
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado. Debe ser un número válido." });
        return;
      }
      const result = await preciosTemporalesCtrl.eliminar(id);
      const status = result != null ? 200 : 400;
      res.status(status).send(result);
    } catch (error) {
      res.status(500).send("Error al eliminar el precio temporal: " + error);
    }
  });

  return router;
};