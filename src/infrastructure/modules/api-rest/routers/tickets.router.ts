import Express from "express";
import { TicketsController } from "../../../../application/tickets.controller"


// import { ProductoController } from "";
// Objetivo: Exponer las rutas de la api
// PATH: es la ruta

export const RutasTicket = () => {
  
  const router = Express.Router();
   const ticketCtrl = new TicketsController();


  // obtener todos los tickets

  // swagger:
  /** 
   * @swagger
   * /tickets:
   *   get: 
   *     description: Obtiene todos los tickets
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Tickets obtenidos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *               properties:
   *                 id_ticket: 
   *                   type: number
   *                   description: ID del ticket
   *                 id_reserva: 
   *                   type: number
   *                   description: ID de la reserva al que pertenece el ticket
   *                 id_vuelo: 
   *                   type: number
   *                   description: ID del vuelo al que pertenece el ticket
   *                 id_pasajero: 
   *                   type: number
   *                   description: ID del pasajero al que pertenece el ticket
   *                 fecha_emision: 
   *                   type: fecha
   *                   description: Fecha de emisión del ticket
   *                 estado_ticket:
   *                   type: string
   *                   description: Estado del ticket
   *       500:
   *         description: Error al obtener los tickets
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */


  router.get("/ticket", (req, res) => { 
    ticketCtrl.obtener().then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send("Error al obtener el ticket:" + error ); // Manejo de errores
    });
  });





  //swagger:
  /** 
   * @swagger
   * /tickets:
   *   post:
   *     description: Agrega un nuevo ticket
   *     tags:
   *       - Tickets
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               id_reserva:
   *                 type: number
   *                 description: ID de la reserva al que pertenece el ticket
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Ticket creado
   *   
   */
   
   router.post("/tickets", async (req, res) => {
    try {
      const payload = req.body;
      // Llamar al controlador para crear la reserva
      const result = await ticketCtrl.check(payload);
      // Enviar la respuesta
      res.status(201).send(result);
    } catch (error: any) {
      console.error('Error :', error);
      // Enviar un error genérico con un código de estado adecuado
      res.status(500).json({ message: error.message || "Error interno del servidor" });
    }
  });

 



  
  router.post("/ticket_2", (req, res) => { 
    const payload = req.body;
    ticketCtrl.agregar(payload).then((result) => {
      res.send(result);
    })
      .catch((error) => {
        res.status(505).send(error);
      });
  });






  // swagger:
  /** 
   * @swagger
   * /tickets:
   *   put:
   *     description: Actualiza un ticket
   *     tags:
   *       - Tickets
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del ticket a actualizar
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object 
   *             properties:
   *               id_reserva:
   *                 type: number
   *                 description: ID de la reserva al que pertenece el ticket
   *               id_vuelo:
   *                 type: number
   *                 description: ID del vuelo al que pertenece el ticket
   *               id_pasajero:
   *                 type: number
   *                 description: ID del pasajero al que pertenece el ticket
   *               fecha_emision:
   *                 type: fecha
   *                 description: Fecha de emisión del ticket
   *               estado_ticket:
   *                 type: string
   *                 description: Estado del ticket
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Ticket actualizado
   *   
   */
  router.put("/ticket", (req, res) => {  
    const payload = req.body;
    ticketCtrl.actualizar(payload).then((result) => {
      res.send(result);
    })
      .catch((error) => {
        res.status(505).send(error);
      });
  });








  // swagger:
  /** 
   * @swagger
   * /tickets/{id}:
   *   get:
   *     description: Obtiene un ticket por su ID
   *     tags:
   *       - Tickets
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del ticket a obtener
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Ticket obtenido
   *       404:
   *         description: Ticket no encontrado
   *   
   */ 
  router.get("/ticket/:id", async (req, res) => { 

    try {
      const idStr = req.params.id;
       const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado." });
        return;
      }
      const result = await ticketCtrl.obtenerById(id);
      if (result != null) {
        res.send({ result });
      } else {
        res.status(404).send({ ok: false, message: "Error" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });







  // swagger:
  /** 
   * @swagger
   * /tickets/{id}:
   *   delete:
   *     description: Elimina un ticket por su ID
   *     tags:
   *       - Tickets
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del ticket a eliminar
   *         required: true
   *         schema:
   *           type: number
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Ticket eliminado
   *       400:
   *         description: Error al eliminar el ticket
   *   
   */ 
  router.delete("/ticket/:id", async (req, res) => {
    try {
      const idStr = req.params.id;
      const id = parseInt(idStr);
      if (Number.isNaN(id)) {
        res.status(400).send({ ok: false, message: "Error en el id enviado" });
        return;
      }
      const result =  await ticketCtrl.eliminar(id);
       const status = result != null ? 200 : 400;
       res.status(status).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
  });


  return router;

};