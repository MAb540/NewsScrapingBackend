import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { GeneralError } from "./utils/errors.js";
import newsRoute from "./routes/newsRouter.js";
import channelsRoute from "./routes/channelRouter.js";



import "./db/connectDB.js";
import "./ScrapingLogic/index.js";
import authRouter from "./routes/api.js";

const app = express();

//logger
app.use(morgan("dev"));

// bodyparser middleware
app.use(express.json());

app.use(cors());

// routes
app.use("/channels", channelsRoute);
app.use("/news", newsRoute);
app.use("/api", authRouter);

app.get("/", (req, res) =>{
  res.send("working");
});


// error Handler
app.use((err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: "error",
      message: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(process.env.PORT || 5000, () =>
  console.log("listening on port", 5000)
);
