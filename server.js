require("dotenv").config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const express = require("express");

const app = express();

app.use(express.json());

const pool = require("./config/database");

pool.query("SELECT NOW()")
  .then((result) => {
    console.log("PostgreSQL connected:", result.rows[0]);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const PORT = 3000;

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






// ADMIN
// Email: admin@example.com
// Password: admin123

// STUDENT
// Email: abdul@example.com
// Password: student123

// TEST STUDENT
// Email: test@example.com
// Password: newpassword123