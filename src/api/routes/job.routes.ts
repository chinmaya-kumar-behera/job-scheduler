// src/api/routes/job.routes.ts
import { Router } from "express";
import {
  createJob,
  disableJob,
  getAllJobs,
  getJobById,
} from "../controllers/job.controller";

const router = Router();

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
// 👇 NEW ROUTE to disable job
// router.patch("/:id/disable", disableJob);

export default router;
