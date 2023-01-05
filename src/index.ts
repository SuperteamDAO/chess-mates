import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { Application, Request, Response } from "express";

import { run } from "@/services";
import { prisma } from "@/helpers";
import router from "@/routes/router";

dotenv.config();

const app: Application = express();

app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "[🚅] The server is up and running",
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1", router);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`[🏄‍♂️] The server is up and running at ${port}`);
  await prisma.$connect();
  console.log(`[📦] Connected to MongoDB database`);
  run();
});
