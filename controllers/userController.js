const { readData, writeData } = require("../services/jsonDatabase");
const bcrypt = require("bcryptjs");

const getUsers = (req, res) => {
  const users = readData("./data/users.json");

  const safeUsers = users.map(({ password, ...user }) => user);

  res.json(safeUsers);
};

const getUser = (req, res) => {
  const users = readData("./data/users.json");

  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const { password, ...safeUser } = user;

  res.json(safeUser);
};

const createUser = async (req, res) => {
  const users = readData("./data/users.json");

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "Name, email, password and role are required"
    });
  }

  if (role !== "STUDENT" && role !== "ADMIN") {
    return res.status(400).json({
      message: "Role must be STUDENT or ADMIN"
    });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).json({
      message: "Email already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Math.max(...users.map((user) => user.id), 0) + 1,
    name,
    email,
    password: hashedPassword,
    role
  };

  users.push(newUser);

  writeData("./data/users.json", users);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  });
};

const updateUser = async (req, res) => {
  const users = readData("./data/users.json");

  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const { name, email, password, role } = req.body;

  if (role && role !== "STUDENT" && role !== "ADMIN") {
    return res.status(400).json({
      message: "Role must be STUDENT or ADMIN"
    });
  }

  if (email && email !== user.email) {
    const existingUser = users.find(
      (user) => user.email === email && user.id !== id
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  writeData("./data/users.json", users);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

const deleteUser = (req, res) => {
  const users = readData("./data/users.json");

  const id = Number(req.params.id);

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  writeData("./data/users.json", users);

  res.json({
    message: "User deleted",
    user: {
      id: deletedUser.id,
      name: deletedUser.name,
      email: deletedUser.email,
      role: deletedUser.role
    }
  });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};