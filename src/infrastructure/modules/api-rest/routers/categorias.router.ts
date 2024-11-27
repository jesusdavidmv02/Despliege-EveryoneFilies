import Express from "express";
import { CategoriaController } from "../../../../application/categoria.controller";

export const RutasCategoria = () => {
  
  const router = Express.Router();
  const categoriaCtrl = new CategoriaController();

  // Ruta para obtener todas las categorías
  //swagger:

  /** 
   * @swagger
   * /categorias:
   *   get: 
   *     description: Obtiene todas las categorías
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Categorias obtenidas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *               properties:
   *                 id: 
   *                   type: number
   *                   description: ID de la categoría
   *                 nombre_categoria: 
   *                   type: string
   *                   description: Nombre de la categoría
   *                 precio_base: 
   *                   type: number
   *                   description: Precio base de la categoría 
   *       500:
   *         description: Error al obtener las categorías
   *         content:
   *           application/json:
   *             schema:
   *               type: object

   */ 

  router.get("/categorias", (req, res) => { 
    categoriaCtrl.obtener().then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send("Error al obtener las categorías: " + error); // Manejo de errores
    });
  });



  // Ruta para agregar una nueva categoría
  //swagger:
  /** 
   * @swagger
   * /categorias:
   *   post:
   *     description: Agrega una nueva categoría
   *     tags:
   *       - Categorias
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               nombre_categoria:
   *                 type: string
   *                 description: Nombre de la categoría
   *               precio_base:
   *                 type: number
   *                 description: Precio base de la categoría
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Categoria creada
   *   
   */ 
  router.post("/categorias", (req, res) => { 
    const payload = req.body;
    categoriaCtrl.agregar(payload).then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send("Error al agregar la categoría: " + error);
    });
  });



  // Ruta para actualizar una categoría

  //swagger 
  /** 
   * @swagger
   * /categorias/{id}:
   *   put:
   *     description: Actualiza una categoría
   *     tags:
   *       - Categorias
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID de la categoría a actualizar
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               nombre_categoria:
   *                 type: string
   *                 description: Nombre de la categoría
   *               precio_base:
   *                 type: number
   *                 description: Precio base de la categoría
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Categoría actualizada
   *   
   */
  router.put("/categorias", (req, res) => {  
    const payload = req.body;
    categoriaCtrl.actualizar(payload).then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send("Error al actualizar la categoría: " + error);
    });
  });



  // Ruta para obtener una categoría por su ID
  //swagger 
  /** 
   * @swagger
   * /categorias/{id}:
   *   get:
   *     description: Obtiene una categoría por su ID
   *     tags:
   *       - Categorias
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID de la categoría a obtener
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Categoría obtenida
   *       404:
   *         description: Categoría no encontrada
   *   
   */
  router.get("/categorias/:id", async (req, res) => { 
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado. Debe ser un número válido." });
        return;
      }
      const result = await categoriaCtrl.obtenerPorId(id);
      if (result != null) {
        res.send({ result });
      } else {
        res.status(404).send({ ok: false, message: "La categoría no fue encontrada." });
      }
    } catch (error) {
      res.status(500).send("Error al obtener la categoría: " + error);
    }
  });



  // Ruta para eliminar una categoría por su ID
  //swagger 
  /** 
   * @swagger
   * /categorias/{id}:
   *   delete:
   *     description: Elimina una categoría por su ID
   *     tags:
   *       - Categorias
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID de la categoría a eliminar
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Categoría eliminada
   *       400:
   *         description: Error al eliminar la categoría
   *   
   */
  router.delete("/categorias/:id", async (req, res) => {
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado. Debe ser un número válido." });
        return;
      }
      const result = await categoriaCtrl.eliminar(id);
      const status = result != null ? 200 : 400;
      res.status(status).send(result);
    } catch (error) {
      res.status(500).send("Error al eliminar la categoría: " + error);
    }
  });

  return router;
};
