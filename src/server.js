require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    // eslint-disable-next-line no-console
    console.log("Connected to MySQL");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("MySQL is not ready yet. Server will still start.");
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
