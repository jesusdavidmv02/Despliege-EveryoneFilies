import Express from "express";
import { VueloController } from "../../../../application/vuelo.Controller";

// import { ProductoController } from "";
// Objetivo: Exponer las rutas de la api
// PATH: es la ruta

export const RutasVuelo = () => {
  
  const router = Express.Router();
   const vueloCtrl = new VueloController();

  
  // swagger:
  /** 
   * @swagger
   * /vuelos:
   *   get: 
   *     description: Obtiene todos los vuelos
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Vuelos obtenidos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *               properties:
   *                 id_vuelo: 
   *                   type: number
   *                   description: ID del vuelo
   *                 cod_vuelo: 
   *                   type: string
   *                   description: Código del vuelo
   *                 aerolinea: 
   *                   type: string
   *                   description: Nombre de la aerolínea
   *                 origen_aeropuerto: 
   *                   type: string
   *                   description: Origen del vuelo
   *                 destino_aeropuerto:  
   *                   type: string
   *                   description: Destino del vuelo
   *                 fecha_salida: 
   *                   type: fecha
   *                   description: Fecha de salida del vuelo
   *                 fecha_llegada: 
   *                   type: fecha
   *                   description: Fecha de llegada del vuelo
   *                 duracion: 
   *                   type: number
   *                   description: Duración del vuelo
   *                 total_asientos:  
   *                   type: number
   *                   description: Total de asientos del vuelo
   *                 asientos_disponibles: 
   *                   type: number
   *                   description: Asientos disponibles del vuelo
   *                 estado_vuelo: 
   *                   type: string
   *                   description: Estado del vuelo
   *       500:
   *         description: Error al obtener los vuelos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
   router.get("/vuelos", (req, res) => { 
    vueloCtrl.obtener().then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send("Error al obtener el vuelo:" + error ); // Manejo de errores
    });
  });


  // swagger:
  /** 
   * @swagger
   * /vuelos:
   *   post:
   *     description: Agrega un nuevo vuelo
   *     tags:
   *       - Vuelos
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               cod_vuelo:
   *                 type: string
   *                 description: Código del vuelo
   *               aerolinea:
   *                 type: string
   *                 description: Nombre de la aerolínea
   *               origen_aeropuerto:
   *                 type: string
   *                 description: Origen del vuelo
   *               destino_aeropuerto:
   *                 type: string
   *                 description: Destino del vuelo
   *               fecha_salida:
   *                 type: string
   *                 description: Fecha de salida del vuelo
   *               fecha_llegada:
   *                 type: string
   *                 description: Fecha de llegada del vuelo
   *               duracion:
   *                 type: number
   *                 description: Duración del vuelo
   *               total_asientos:
   *                 type: number
   *                 description: Total de asientos del vuelo
   *               asientos_disponibles:
   *                 type: number
   *                 description: Asientos disponibles del vuelo
   *               estado_vuelo:
   *                 type: string
   *                 description: Estado del vuelo
   *               precio_base_vuelo:
   *                 type: number
   *                 description: precio base 
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Vuelo creado
   *
   * 
   */
  router.post("/vuelos", (req, res) => { 
    const payload = req.body;
    vueloCtrl.agregar(payload).then((result) => {
      res.send(result);
    })
      .catch((error) => {
        res.status(505).send(error);
      });
  });









  // swagger:
  /** 
   * @swagger
   * /vuelos:
   *   put:
   *     description: Actualiza un vuelo
   *     tags:
   *       - Vuelos
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del vuelo a actualizar
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
   *                 description: Código del vuelo
   *               aerolinea:
   *                 type: string
   *                 description: Nombre de la aerolínea
   *               origen_aeropuerto:
   *                 type: string
   *                 description: Origen del vuelo
   *               destino_aeropuerto:
   *                 type: string
   *                 description: Destino del vuelo
   *               fecha_salida:
   *                 type: fecha
   *                 description: Fecha de salida del vuelo
   *               fecha_llegada:
   *                 type: fecha    
   *                 description: Fecha de llegada del vuelo
   *               duracion:
   *                 type: number
   *                 description: Duración del vuelo
   *               total_asientos:
   *                 type: number
   *                 description: Total de asientos del vuelo
   *               asientos_disponibles:
   *                 type: number
   *                 description: Asientos disponibles del vuelo
   *               estado_vuelo:
   *                 type: string
   *                 description: Estado del vuelo
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Vuelo actualizado
   *   
   */
  router.put("/vuelos", (req, res) => {  
    const payload = req.body;
    vueloCtrl.actualizar(payload).then((result) => {
      res.send(result);
    })
      .catch((error) => {
        res.status(505).send(error);
      });
  });



  // swagger:
  /** 
   * @swagger
   * /vuelos/{id}:
   *   get:
   *     description: Obtiene un vuelo por su ID
   *     tags:
   *       - Vuelos
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del vuelo a obtener
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Vuelo obtenido
   *       404:
   *         description: Vuelo no encontrado
   *   
   */

  router.get("/vuelos/:id", async (req, res) => { 

    try {
      const idStr = req.params.id;
       const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado .Debe ser un número válido." });
        return;
      }
      const result = await vueloCtrl.obtenerPorId(id);
      if (result != null) {
        res.send({ result });
      } else {
        res.status(404).send({ ok: false, message: "Erroor" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });






  // swagger:
  /** 
   * @swagger
   * /vuelos/{id}:
   *   delete:
   *     description: Elimina un vuelo por su ID
   *     tags:
   *       - Vuelos
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del vuelo a eliminar
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Vuelo eliminado
   *       400:
   *         description: Error al eliminar el vuelo
   *   
   */
  router.delete("/vuelos/:id", async (req, res) => {
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado" });
        return;
      }
      const result =  await vueloCtrl.eliminar(id);
       const status = result != null ? 200 : 400;
       res.status(status).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
  });

  router.patch("/vuelos/:id", async (req, res) => {
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
  
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "El ID proporcionado no es válido" });
        return;
      }
  
      const datos = req.body;
  
      const resultado = await vueloCtrl.actualizarParcial(id, datos);
      if (resultado.ok) {
        res.status(200).send(resultado);
      } else {
        res.status(400).send(resultado);
      }
    } catch (error) {
      console.error("Error al actualizar vuelo:", error);
      res.status(500).send({ ok: false, message: "Error interno del servidor", error });
    }
  });


  //Ruta del cliente
  router.post("/vuelos/buscar", async (req, res) => {
    const { origen_aeropuerto, destino_aeropuerto, fecha_salida } = req.body;

    if (origen_aeropuerto || !destino_aeropuerto || !fecha_salida) {
      res.status(400).send({ ok: false, message: "Faltan parámetros de búsqueda" });
    }
  
    try {
      const result = await vueloCtrl.buscarVuelos(origen_aeropuerto, destino_aeropuerto, fecha_salida);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ ok: false, message: "Error al buscar vuelos", error });
    }
  });


  return router;

};