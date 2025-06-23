// src/api/routes/job.routes.ts
import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
} from "../controllers/job.controller";

const router = Router();

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);

export default router;
