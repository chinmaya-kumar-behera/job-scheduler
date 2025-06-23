import { PrismaClient } from "@prisma/client";
// import { jobQueue } from "./config/queue";
import parser from "cron-parser";
import { jobQueue } from "./config/bullmq";

const prisma = new PrismaClient();

async function checkAndEnqueueJobs() {
  const now = new Date();

  const jobs = await prisma.job.findMany({
    where: { isActive: true },
  });

  for (const job of jobs) {
    try {
      const interval = parser.parseExpression(job.schedule, {
        currentDate: job.lastRunAt || new Date(0),
      });

      const nextRun = interval.next().toDate();

      if (nextRun <= now) {
        console.log(`⏰ Enqueuing Job: ${job.name}`);

        await jobQueue.add(job.type, {
          jobId: job.id,
          payload: job.payload,
        });

        const newNextRun = parser
          .parseExpression(job.schedule, {
            currentDate: now,
          })
          .next()
          .toDate();

        await prisma.job.update({
          where: { id: job.id },
          data: {
            lastRunAt: now,
            nextRunAt: newNextRun,
          },
        });
      }
    } catch (err) {
      console.error(`❌ Error processing job: ${job.id}`, err);
    }
  }
}

setInterval(checkAndEnqueueJobs, 60 * 1000); // every minute

console.log("📅 DB-based job scheduler is running...");
