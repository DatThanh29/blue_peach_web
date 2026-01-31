import dotenv from "dotenv";
import app from "./app";
import router from "./routes";

dotenv.config();

app.use("/api", router);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`API running: http://localhost:${port}/api/health`);
});
