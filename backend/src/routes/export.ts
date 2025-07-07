import { Router } from "express";
import { ExportController } from "../controllers/ExportController";

const router = Router();
const exportController = new ExportController();

// Export routes
router.post("/word", exportController.exportToWord.bind(exportController));
router.post("/pdf", exportController.exportToPDF.bind(exportController));
router.get("/templates", exportController.getTemplates.bind(exportController));
router.get(
  "/download/:fileName",
  exportController.downloadFile.bind(exportController)
);

export default router;
