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
        status: "active",
        nextRunAt: null,
        lastRunAt: null,
      },
    });

    return job;
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
