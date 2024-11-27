import Express from "express";
import {SeleccionarCategoriaController} from "../../../../application/seleccionar_categoria-controller"

export const RutasSeleccionarCategoria = () => {

    const router = Express.Router();
    const seleccionarCtrl = new SeleccionarCategoriaController();

    router.post("/seleccionarCategoria", async (req, res) => {
        try {
            const { id_vuelo, categoria } = req.body;
            const resultado = await seleccionarCtrl.seleccionarCategoriaYCalcularPrecio({ id_vuelo, categoria });
            res.send(resultado);
        } catch (error) {
            res.status(500).send(error);
        }
    });
    return router;
}



