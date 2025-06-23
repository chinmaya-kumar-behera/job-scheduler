import { PrismaClient } from "@prisma/client";
import { jobQueue } from "../config/bullmq";

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
    await jobQueue.add(type, {
      jobId: job.id,
      payload,
    }, {
      repeat: {
        cron: schedule as any,
        tz: "UTC"
      } as any,
      jobId: job.id // unique job id to avoid duplicates
    });

    return job;
  }

  async enqueueActiveJobs() {
    const activeJobs = await prisma.job.findMany({ where: { isActive: true } });

    for (const job of activeJobs) {
      await jobQueue.add(job.type, {
        jobId: job.id,
        payload: job.payload,
      }, {
        repeat: {
          cron: job.schedule as any,
          tz: "UTC"
        } as any,
        jobId: job.id
      });
    }
  }

  async getAllJobs() {
    return await prisma.job.findMany();
  }

  async getJobById(id: string) {
    return await prisma.job.findUnique({ where: { id } });
  }

  async disableJobById(jobId: string) {
    return await prisma.job.update({
      where: { id: jobId },
      data: { isActive: false },
    });
  };
}
