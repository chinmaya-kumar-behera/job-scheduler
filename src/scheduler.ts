/* Scheduler is deprecated since we use BullMQ repeatable jobs now */
export async function checkAndEnqueueJobs() {
  console.log("Scheduler is deprecated. Repeatable jobs are handled by BullMQ.");
}
