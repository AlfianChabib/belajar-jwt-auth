import express from "express";
import dotenv from "dotenv";
import apiRouter from "./common/router/api.router";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
