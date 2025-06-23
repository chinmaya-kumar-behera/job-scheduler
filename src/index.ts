import express from "express";
import dotenv from "dotenv";
import router from "./api/routes/job.routes";
import { runWorker } from "./worker";
import { JobService } from "./services/job.service";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/jobs", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Start worker
  console.log("Starting worker...");
  runWorker();
  console.log("Worker started.");

  // On server start, enqueue all active jobs from DB
  const jobService = new JobService();
  await jobService.enqueueActiveJobs();
});
