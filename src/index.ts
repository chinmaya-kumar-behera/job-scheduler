import express from "express";
import dotenv from "dotenv";
import router from "./api/routes/job.routes";
import { checkAndEnqueueJobs } from "./scheduler";
import { runWorker } from "./worker";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/jobs", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Start worker
  runWorker();

  // On server start, enqueue all jobs
  await checkAndEnqueueJobs();
});
