import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const timeLog = (req, res, next) => {
  console.log("Time: ", Date.now());
  next();
};

router.use(timeLog);

interface ping {
  apiKey: string;
}

interface PingBody<T> extends Request {
  body: T;
}

router.get("/status", (req, res) => {
  res.json({ success: true, time: Date.now() });
});

router.get("/", async (req: PingBody<ping>, res) => {
  if (!req.body.apiKey) {
    return res.json({
      success: false,
      reason: "Authentication Failed",
      reasonID: 4030,
    });
  }

  // ! Validate APIKEY
  let apiKey = await prisma.apiKey.findUnique({
    where: {
      key: req.body.apiKey,
    },
  });

  if (!apiKey) {
    return res.json({
      success: false,
      reason: "Authentication Failed",
      reasonID: 4031,
    });
  }

  if (apiKey.expires < new Date()) {
    return res.json({
      success: false,
      reason: "Authentication Failed",
      reasonID: 4031,
    });
  }
});
