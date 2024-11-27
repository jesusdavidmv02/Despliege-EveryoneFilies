import Express from "express";
import { routes } from "./src/infrastructure/modules/api-rest/routers/index.router";
import middleware404 from "./src/infrastructure/modules/api-rest/middleware/middleware-404";
import { AppDataSourceMysql } from "./src/infrastructure/db/source.orm";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swaggerConfig";


const createServer = async () => {
  try {

    console.log("Entorno:", process.env.NODE_ENV);

    AppDataSourceMysql.initialize().then(() => {
        console.log("Conexión exitosa");
      }).catch((err) => {
        console.error("Error en la conexión", err);
      });

      //AppDataSourceMysql.initialize().then(() => {
      //     console.log("Conexión exitosa");
      //   }).catch((err) => {
      //     console.error("Error en la conexión", err);
      // });

    console.log("Datasource inicializado");

    const app = Express();
    app.use(Express.json());

    app.get("/api", (req, res) => {
      res.send({ message: "Bienvenido a la API " });
    });

    app.use("/api/v1", routes());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use(middleware404);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor Api-Rest ejecutando: http://localhost:${PORT}`);
      console.log(`Documentacion Swagger: http://localhost:${PORT}/api-docs`);
    });

  } 
  catch (error) {
    console.error(error);
    console.error(`Error al iniciar el servidor web: ${error}`);
   }

};

createServer();
