import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearJobs() {
  try {
    const deleted = await prisma.job.deleteMany({});
    console.log(`Deleted ${deleted.count} job records from the database.`);
  } catch (error) {
    console.error('Error deleting job records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearJobs();
