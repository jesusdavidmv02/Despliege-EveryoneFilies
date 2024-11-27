import Express from "express";
import { AsientoController } from "../../../../application/asiento.controller";

export const RutasAsiento = () => {
  
  const router = Express.Router();
  const asientoCtrl = new AsientoController();

  // Ruta para obtener todos los asientos

  // swagger:
  
  /** 
   * @swagger
   * /asientos:
   *   get: 
   *     description: Obtiene todos los asientos
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Asientos obtenidos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *               properties:
   *                 id_asiento: 
   *                   type: number
   *                   description: ID del asiento
   *                 cod_vuelo: 
   *                   type: string
   *                   description: Código del vuelo al que pertenece el asiento
   *                 disponible: 
   *                   type: boolean
   *                   description: Indica si el asiento está disponible o no
   *                 id_categoria: 
   *                   type: number
   *                   description: ID de la categoría al que pertenece el asiento
   *       500:
   *         description: Error al obtener los asientos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */ 
  router.get("/asientos", (req, res) => { 
    asientoCtrl.obtener().then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send("Error al obtener los asientos: " + error); // Manejo de errores
    });
  });



  // Ruta para agregar un nuevo asiento

  // swagger:
  /** 
   * @swagger
   * /asientos:
   *   post:
   *     description: Agrega un nuevo asiento
   *     tags:
   *       - Asientos
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               cod_vuelo:
   *                 type: string
   *                 description: Código del vuelo al que pertenece el asiento
   *               disponible:
   *                 type: boolean
   *                 description: Indica si el asiento está disponible o no
   *               id_categoria:
   *                 type: number
   *                 description: ID de la categoría al que pertenece el asiento
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Asiento creado
   *   
   */
  router.post("/asientos", (req, res) => { 
    const payload = req.body;
    asientoCtrl.agregar(payload).then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send("Error al agregar el asiento: " + error);
    });
  });

  // Ruta para actualizar un asiento

  //swagger 
  /** 
   * @swagger
   * /asientos/{id}:
   *   put:
   *     description: Actualiza un asiento
   *     tags:
   *       - Asientos
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del asiento a actualizar
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               cod_vuelo:
   *                 type: string
   *                 description: Código del vuelo al que pertenece el asiento
   *               disponible:
   *                 type: boolean
   *                 description: Indica si el asiento está disponible o no
   *               id_categoria:
   *                 type: number
   *                 description: ID de la categoría al que pertenece el asiento
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Asiento actualizado
   *   
   */ 
  router.put("/asientos", (req, res) => {  
    const payload = req.body;
    asientoCtrl.actualizar(payload).then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send("Error al actualizar el asiento: " + error);
    });
  });

  // Ruta para obtener un asiento por su ID

  //swagger 
  /** 
   * @swagger
   * /asientos/{id}:
   *   get:
   *     description: Obtiene un asiento por su ID
   *     tags:
   *       - Asientos
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del asiento a obtener
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Asiento obtenido
   *       404:
   *         description: Asiento no encontrado
   *   
   */
  
  router.get("/asientos/:id", async (req, res) => { 
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado. Debe ser un número válido." });
        return;
      }
      const result = await asientoCtrl.obtenerPorId(id);
      if (result != null) {
        res.send({ result });
      } else {
        res.status(404).send({ ok: false, message: "El asiento no fue encontrado." });
      }
    } catch (error) {
      res.status(500).send("Error al obtener el asiento: " + error);
    }
  });



  // Ruta para eliminar un asiento por su ID

  //swagger 
  /** 
   * @swagger
   * /asientos/{id}:
   *   delete:
   *     description: Elimina un asiento por su ID
   *     tags:
   *       - Asientos
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del asiento a eliminar
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Asiento eliminado
   *       400:
   *         description: Error al eliminar el asiento
   *   
   */ 
  router.delete("/asientos/:id", async (req, res) => {
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado. Debe ser un número válido." });
        return;
      }
      const result = await asientoCtrl.eliminar(id);
      const status = result != null ? 200 : 400;
      res.status(status).send(result);
    } catch (error) {
      res.status(500).send("Error al eliminar el asiento: " + error);
    }
  });

  return router;
};
