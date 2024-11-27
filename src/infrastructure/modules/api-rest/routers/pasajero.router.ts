import express from "express";
import { PasajeroController } from '../../../../application/pasajero.controller';

export const PasajeroRouter = () => {
    const router = express.Router()

    const pasajeroCtrl = new PasajeroController();


  // Ruta para crear un pasajero

  // swagger:
  /** 
   * @swagger
   * /pasajero:
   *   post:
   *     description: Crea un nuevo pasajero
   *     tags:
   *       - Pasajeros
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               id_pasajero:
   *                 type: number
   *                 description: ID del pasajero
   *               nombre:
   *                 type: string
   *                 description: Nombre del pasajero
   *               apellido:
   *                 type: string
   *                 description: Apellido del pasajero
   *               email:
   *                 type: string
   *                 description: Email del pasajero
   *               telefono:
   *                 type: number
   *                 description: Telefono del pasajero
   *               nacionalidad:
   *                 type: string
   *                 description: Nacionalidad del pasajero
   *               id_pasaporte:
   *                 type: number
   *                 description: ID del pasaporte del pasajero
   *               
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Pasajero creado
   *   
   */ 
  router.post("/pasajero", (req, res) => {
    // Capturando el body que el cliente envia en la solitud
    const payload = req.body;
    // Resolver la promesa con then-catch del controlador
    pasajeroCtrl
      .agregar(payload)
      .then((result) => {
        
        const status = result.ok === true ? 200 : 400;
        res.status(status).send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });







  //Ruta para obtener un pasajero por su ID
  //swagger:
  /** 
   * @swagger
   * /pasajero/{id}:
   *   get:
   *     description: Obtiene un pasajero por su ID
   *     tags:
   *       - Pasajeros
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del pasajero a obtener
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Pasajero obtenido
   *       404:
   *         description: Pasajero no encontrado
   *   
   */
  router.get("/pasajero/:id", (req, res) => {
    const id = req.params.id
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




  // ruta para obtener todos los pasajeros
  //swagger:
  /** 
   * @swagger
   * /pasajeros:
   *   get: 
   *     description: Obtiene todos los pasajeros
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Pasajeros obtenidos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *               properties:
   *                 id_pasajero: 
   *                   type: number
   *                   description: ID del pasajero
   *                 nombre: 
   *                   type: string
   *                   description: Nombre del pasajero 
   *                 apellido: 
   *                   type: string
   *                   description: Apellido del pasajero
   *                 
   *                 email:   
   *                   type: string
   *                   description: Email del pasajero
   *                 telefono:  
   *                   type: string
   *                   description: Telefono del pasajero
   *                 nacionalidad: 
   *                   type: string
   *                   description: Nacionalidad del pasajero
   *                 id_pasaporte: 
   *                   type: number
   *                   description: ID del pasaporte del pasajero
   *       500:
   *         description: Error al obtener los pasajeros
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
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



  // actualizar un pasajero
  //swagger:
  /** 
   * @swagger
   * /pasajero:
   *   put:
   *     description: Actualiza un pasajero
   *     tags:
   *       - Pasajeros
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del pasajero a actualizar
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               id_pasajero:
   *                 type: number
   *                 description: ID del pasajero
   *               nombre:
   *                 type: string
   *                 description: Nombre del pasajero
   *               apellido:
   *                 type: string
   *                 description: Apellido del pasajero
   *               email:
   *                 type: string
   *                 description: Email del pasajero
   *               telefono:
   *                 type: number
   *                 description: Telefono del pasajero
   *               nacionalidad:
   *                 type: string
   *                 description: Nacionalidad del pasajero
   *               id_pasaporte:
   *                 type: number
   *                 description: ID del pasaporte del pasajero
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Pasajero actualizado
   *   
   */
  router.patch("/pasajero", (req, res) => {
    const payload = req.body;
    pasajeroCtrl
      .actualizar(payload)
      .then((result) => {
        const status = result.ok === true ? 200 : 400;
        res.status(status).send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });


  //obtiner un pasajero por su nombre y email
  //swagger:
  /** 
   * @swagger
   * /pasajero/buscar:
   *   get:
   *     description: Obtiene un pasajero por su nombre y email
   *     tags:
   *       - Pasajeros
   *     parameters:
   *       - name: nombre
   *         in: query
   *         description: Nombre del pasajero a buscar
   *         required: true
   *         schema:
   *           type: string
   *       - name: email
   *         in: query
   *         description: Email del pasajero a buscar
   *         required: true
   *         schema:
   *           type: string
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Pasajero obtenido
   *       404:
   *         description: Pasajero no encontrado
   *   
   */
  router.get("/pasajero/buscar", (req, res) => {
    const payload = req.body;
    pasajeroCtrl
      .obtenerPorCriterio(payload)
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