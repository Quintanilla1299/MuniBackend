// routes/securityServiceRoutes.js
import { Router } from "express";
import SecurityServiceController from "../controllers/security_service.controller.js";
import uploadFiles, { checkEntityExists } from "../images/upload.js";

const securityServiceRouter = Router();
const uploadImages = uploadFiles("security_service").array("images", 10);
// Rutas CRUD para servicios de seguridad
securityServiceRouter.post(
  "/agregar",
  uploadImages,
  SecurityServiceController.createOrUpdate
);
securityServiceRouter.put(
  "/actualizar/:id",
  uploadImages,
  SecurityServiceController.createOrUpdate
);
securityServiceRouter.delete("/eliminar/:id", SecurityServiceController.delete); // Eliminar un servicio por ID

export default securityServiceRouter;
