import cors from "cors";
import express, { Express, Response, Request, NextFunction } from "express";

const app: Express = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:3000"],
  })
);

// SET ROUTES HERE

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "fail",
    message: "URL not found!",
  });
});
