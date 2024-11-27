// import * as dialogflow from 'dialogflow';
// import { v4 as uuidv4 } from 'uuid';

// async function detectaIntencion(texto: string, proyectoId: string) {
//   // Genera un ID de sesión único
//   const sessionId = uuidv4();

//   // Crea una sesión de cliente
//   const sessionClient = new dialogflow.SessionsClient();

//   // Construye la ruta de la sesión
//   const sessionPath = sessionClient.sessionPath(proyectoId, sessionId);

//   // Construye la solicitud
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: texto,
//         languageCode: 'es',  // Cambia según el idioma de tu agente
//       },
//     },
//   };

//   try {
//     // Llama a la API de Dialogflow y detecta la intención
//     const responses = await sessionClient.detectIntent(request);
//     const result = responses[0].queryResult;

//     console.log(`Texto: ${result?.queryText}`);
//     console.log(`Intención detectada: ${result?.intent?.displayName}`);
//     console.log(`Respuesta: ${result?.fulfillmentText}`);

//     return result;
//   } catch (error) {
//     console.error('Error al detectar la intención:', error);
//   }
// }

// // Llama a la función con un texto de prueba y tu ID de proyecto
// detectaIntencion('Hola, ¿cómo estás?', 'tu-proyecto-id');
