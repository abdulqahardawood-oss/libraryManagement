const { readData } = require("../services/jsonDatabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  const users = readData("./data/users.json");

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  res.json({
    message: "Login successful",
    token
  });
};

module.exports = {
  login
};