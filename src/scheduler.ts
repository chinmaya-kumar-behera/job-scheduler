import { PrismaClient } from "@prisma/client";
import { jobQueue } from "./config/bullmq";

const prisma = new PrismaClient();

export async function checkAndEnqueueJobs() {
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
  });

  console.log(`📦 Found ${jobs.length} active jobs. Enqueuing all...`);

  for (const job of jobs) {
    try {
      await jobQueue.add(job.type, {
        jobId: job.id,
        payload: job.payload,
      });

      console.log(`✅ Enqueued job: ${job.name} (ID: ${job.id})`);
    } catch (err) {
      console.error(`❌ Failed to enqueue job ${job.id}:`, err);
    }
  }
}
