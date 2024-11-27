import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Versión de la especificación OpenAPI
    info: {
      title: "API de Reservaciones",
      version: "1.0.0",
      description: "Documentación de la API de Reservas que gestiona usuarios",
    },
    servers: [
      {
        url: "https://despliege-everyonefilies-production.up.railway.app/api/v1", // URL base de la API
      },
    ],
  }, 
  apis: [path.join(__dirname, "./src/infrastructure/modules/api-rest/routers/*.ts")], // Ruta a los archivos de definición de rutas
};


// Generación de la documentación Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Exportación de la documentación
export default swaggerDocs;
