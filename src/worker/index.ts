// src/worker/index.ts (refactor worker here if not already)
import { Worker } from "bullmq";
import { redisOptions } from "../config/redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function runWorker() {
  const worker = new Worker(
    "jobs",
    async (job) => {
      console.log(`🛠️  Processing job: ${job.name} | ID: ${job.id}`);

      const { jobId, payload } = job.data;

      // Simulate task based on job type
      if (job.name === "email") {
        console.log(`📧 Sending email with data:`, payload);
        // ... actual logic or mock
      }

      // Update lastRunAt just in case
      await prisma.job.update({
        where: { id: jobId },
        data: { lastRunAt: new Date() },
      });
    },
    { connection: redisOptions }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
  });

  console.log("👷 Worker initialized and running...");
}
