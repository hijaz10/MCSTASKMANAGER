import "./config/db";
import app from "./app";
const port: number = 3000;

app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
});
