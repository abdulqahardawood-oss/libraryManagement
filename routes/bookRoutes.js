const express = require("express");
const router = express.Router();

const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");
const {
  authenticate,
  requireAdmin
} = require("../middleware/authMiddleware");

router.get("/", authenticate, getBooks);
router.get("/:id", authenticate, getBook);

router.post("/", authenticate, requireAdmin, createBook);
router.put("/:id", authenticate, requireAdmin, updateBook);
router.delete("/:id", authenticate, requireAdmin, deleteBook);

module.exports = router;