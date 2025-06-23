import express from "express";
import dotenv from "dotenv";
import jobRoutes from "./api/routes/job.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/jobs", jobRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
