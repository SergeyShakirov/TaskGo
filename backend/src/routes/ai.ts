import { Router } from "express";
import { AIController } from "../controllers/AIController";

const router = Router();
const aiController = new AIController();

// AI routes powered by DeepSeek
router.post(
  "/generate-description",
  aiController.generateDescription.bind(aiController)
);
router.post("/estimate", aiController.estimateTask.bind(aiController));
router.post(
  "/suggest-improvements",
  aiController.suggestImprovements.bind(aiController)
);
router.post(
  "/suggest-categories",
  aiController.suggestCategories.bind(aiController)
);
router.post(
  "/analyze-complexity",
  aiController.analyzeComplexity.bind(aiController)
);

// Дополнительные endpoints для DeepSeek
router.post(
  "/deepseek/generate",
  aiController.generateDescription.bind(aiController)
);
router.post("/deepseek/estimate", aiController.estimateTask.bind(aiController));
router.post(
  "/deepseek/improve",
  aiController.suggestImprovements.bind(aiController)
);

export default router;
