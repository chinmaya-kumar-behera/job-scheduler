import { PrismaClient } from "@prisma/client";
import { jobQueue } from "../config/bullmq";
import { RepeatOptions } from "bullmq";

const prisma = new PrismaClient();

type CreateJobInput = {
  name: string;
  type: string;
  payload: any;
  schedule: string; // cron string like "0 10 * * 1"
};

export class JobService {
  async createAndScheduleJob(input: CreateJobInput) {
    const { name, type, payload, schedule } = input;

    // Save to PostgreSQL only
    const job = await prisma.job.create({
      data: {
        name,
        type,
        payload,
        schedule,
        isActive: true,
        nextRunAt: null,
        lastRunAt: null,
      },
    });

    // 🧠 Add repeatable job to BullMQ with cron schedule
    await jobQueue.add(
      type,
      {
        jobId: job.id,
        payload,
      },
      {
        repeat: {
          cron: schedule as any,
          tz: "UTC",
        } as any,
        jobId: job.id, // unique job id to avoid duplicates
      }
    );

    return job;
  }

  async enqueueActiveJobs() {
    const activeJobs = await prisma.job.findMany({ where: { isActive: true } });
    console.log("Enqueuing active jobs:", activeJobs.length);

    for (const job of activeJobs) {
      console.log(
        `Enqueuing job: ${job.name} (ID: ${job.id}) with schedule: ${job.schedule}`
      );
      await jobQueue.add(
        job.type,
        {
          jobId: job.id,
          payload: job.payload,
        },
        {
          repeat: {
            cron: job.schedule as any,
            tz: "UTC",
          } as any,
          jobId: job.id,
        }
      );
    }
  }

  async getAllJobs() {
    return await prisma.job.findMany();
  }

  async getJobById(id: string) {
    return await prisma.job.findUnique({ where: { id } });
  }

  async disableJobById(jobId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job not found");

    const repeatableJobs = await jobQueue.getRepeatableJobs();
    console.log("Repeatable jobs in queue:", repeatableJobs);

    // Try to find the repeatable job by matching jobId in the repeat options
    const targetJob = repeatableJobs.find((j) => {
      try {
        const jobIdInOpts = j.id; // j.id is the repeatable job id string
        // The jobId is stored in the job data payload, but not directly accessible here
        // So we match by comparing the jobId with the repeatable job id string or key
        return j.key.includes(jobId);
      } catch {
        return false;
      }
    });

    if (targetJob) {
      console.log("🧹 Removing repeatable job with key:", targetJob.key);
      await jobQueue.removeRepeatableByKey(targetJob.key);
    } else {
      console.warn(`⚠️ No repeatable job found in Redis for job ID: ${jobId}`);
    }

    // Update DB
    return await prisma.job.update({
      where: { id: jobId },
      data: { isActive: false },
    });
  }
}
