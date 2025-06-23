import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { runWorker } from "./worker";
import router from "./api/routes/job.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/jobs", router);

// Start API Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API server listening on http://localhost:${PORT}`);

  // 🔁 Start BullMQ worker here
  runWorker();
});
