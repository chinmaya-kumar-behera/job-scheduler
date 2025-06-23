import { Request, Response } from "express";
import { JobService } from "../../services/job.service";

const jobService = new JobService();

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, payload, schedule } = req.body;

    if (!name || !type || !schedule) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const job = await jobService.createAndScheduleJob({
      name,
      type,
      payload,
      schedule,
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const jobs = await jobService.getAllJobs();
  res.json(jobs);
};

export const getJobById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const job = await jobService.getJobById(id);

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.json(job);
};

export const disableJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  const jobId = req.params.id;

  try {
    const updatedJob = await jobService.disableJobById(jobId);

    res.status(200).json({
      message: "Job disabled successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("❌ Failed to disable job", error);
    res.status(500).json({ error: "Failed to disable job" });
  }
};
