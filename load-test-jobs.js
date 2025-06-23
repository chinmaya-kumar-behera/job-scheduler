const axios = require('axios');

const API_URL = 'http://localhost:3000/jobs'; // Adjust if needed

// Sample job types and schedules
const jobTypes = [
  { jobCode: 'health-check', schedule: '*/1 * * * *' }, // Every minute
  { jobCode: 'email', schedule: '*/1 * * * *' }, // Every minute
  { jobCode: 'data-processing', schedule: '*/1 * * * *' }, // Every minute
  { jobCode: 'report-generation', schedule: '*/1 * * * *' }, // Every minute
  { jobCode: 'cleanup', schedule: '*/1 * * * *' }, // Every minute
];

// Generate random payload for jobs
function generatePayload(jobCode) {
  switch (jobCode) {
    case 'health-check':
      return { url: 'https://example.com/health', jobCode };
    case 'email':
      return { to: 'user@example.com', subject: 'Test Email', body: 'Hello from load test', jobCode };
    case 'data-processing':
      return { datasetId: Math.floor(Math.random() * 1000), jobCode };
    case 'report-generation':
      return { reportType: 'weekly', jobCode };
    case 'cleanup':
      return { tempFolder: '/tmp/files', jobCode };
    default:
      return { jobCode };
  }
}


async function createJob(name, jobCode, schedule, payload) {
  try {
    const response = await axios.post(API_URL, {
      name,
      type: jobCode,
      schedule,
      payload,
    });
    console.log(`Created job: ${name} (${jobCode})`);
  } catch (error) {
    console.error(`Failed to create job: ${name}`, error.message);
  }
}

async function runLoadTest() {
  const totalJobs = 6000;
  for (let i = 0; i < totalJobs; i++) {
    const jobType = jobTypes[i % jobTypes.length];
    const jobName = `${jobType.jobCode}-job-${i + 1}`;
    const payload = generatePayload(jobType.jobCode);
    await createJob(jobName, jobType.jobCode, jobType.schedule, payload);
  }
  console.log('Load test job creation completed.');
}

runLoadTest();
