import { Worker, Job } from "bullmq";
import { redisOptions } from "../config/redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jobWorker = new Worker(
  "jobs",
  async (job: Job) => {
    const { jobId, payload } = job.data;

    console.log(`▶️ Running job [${job.name}] with ID: ${jobId}`);

    // Example: dummy job logic
    if (job.name === "email") {
      console.log(`📧 Sending email to: ${payload.to}`);
      console.log(`Subject: ${payload.subject}`);
      // Here you could integrate with real mailer (e.g. nodemailer)
    } else {
      console.log(`⚙️ Unrecognized job type: ${job.name}`);
    }

    // Update job status in DB
    await prisma.job.update({
      where: { id: jobId },
      data: {
        lastRunAt: new Date(),
        // Optional: calculate nextRunAt based on cron (advanced)
      },
    });
  },
  {
    connection: redisOptions,
  }
);

// Error handling
jobWorker.on("failed", (job, err) => {
  console.error(`❌ Job failed [${job?.name}] ID: ${job?.id}`, err);
});

jobWorker.on("completed", (job) => {
  console.log(`✅ Job completed [${job.name}] ID: ${job.id}`);
});

export default jobWorker;
