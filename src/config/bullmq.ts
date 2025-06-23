import { Queue } from "bullmq";
import { redisOptions } from "./redis";

export const jobQueue = new Queue("jobs", {
  connection: redisOptions,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
  },
});
