// src/worker.ts
import { Worker } from "bullmq";
import { redisOptions } from "../config/redis";
// import { redisOptions } from "./config/redis";

export function runWorker() {
  const worker = new Worker(
    "jobs",
    async (job) => {
      console.log("🔧 Running job:", job.name);
      // console.log("Job details:", JSON.stringify(job, null, 2));

      // Job logic based on jobCode in payload
      const jobCode = job.data.payload.jobCode;
      switch (jobCode) {
        case "health-check":
          console.log("🩺 Performing health check for URL:", job.data.payload.url);
          try {
            const response = await fetch(job.data.payload.url);
            if (response.ok) {
              console.log(`🩺 Health check successful: ${response.status}`);
            } else {
              console.error(`🩺 Health check failed: ${response.status}`);
            }
          } catch (error) {
            console.error(`🩺 Health check error:`, error);
          }
          console.log("Health check case executed");
          break;
        case "email":
          console.log("📧 Sending email with payload:", job.data.payload);
          // Simulate sending email
          console.log("Email case executed");
          break;
        case "data-processing":
          console.log("🔢 Processing data for dataset ID:", job.data.payload.datasetId);
          // Simulate data processing
          console.log("Data-processing case executed");
          break;
        case "report-generation":
          console.log("📊 Generating report of type:", job.data.payload.reportType);
          // Simulate report generation
          console.log("Report-generation case executed");
          break;
        case "cleanup":
          console.log("🧹 Cleaning up folder:", job.data.payload.tempFolder);
          // Simulate cleanup operation
          console.log("Cleanup case executed");
          break;
        default:
          console.log("❓ Unknown job code:", jobCode);
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
