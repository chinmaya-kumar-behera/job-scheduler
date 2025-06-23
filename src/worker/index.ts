// src/worker.ts
import { Worker } from "bullmq";
import { redisOptions } from "../config/redis";
// import { redisOptions } from "./config/redis";

export function runWorker() {
  const worker = new Worker(
    "jobs",
    async (job) => {
      console.log("🔧 Running job:", job.name, "with data:", job.data);
      console.log("Job details:", JSON.stringify(job, null, 2));

      // Dummy job logic based on type
      if (job.name === "email") {
        console.log("📧 Sending email with payload:", job.data.payload);
        // Imagine sending email here
      } else {
        console.log("🔢 Processing job of type:", job.name);
      }

      return "done";
    },
    { connection: redisOptions }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job?.id}`, err);
  });
}
