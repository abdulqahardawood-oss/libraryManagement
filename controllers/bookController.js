const { readData, writeData } = require("../services/jsonDatabase");

const getBooks = (req, res) => {
  const books = readData("./data/books.json");

  res.json(books);
};

const getBook = (req, res) => {
  const books = readData("./data/books.json");

  const id = Number(req.params.id);

  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  res.json(book);
};

const createBook = (req, res) => {
  const books = readData("./data/books.json");

  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required"
    });
  }

  const newBook = {
    id: Math.max(...books.map((book) => book.id), 0) + 1,
    title,
    author
  };

  books.push(newBook);

  writeData("./data/books.json", books);

  res.status(201).json(newBook);
};

const updateBook = (req, res) => {
  const books = readData("./data/books.json");

  const id = Number(req.params.id);

  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required"
    });
  }

  book.title = title;
  book.author = author;

  writeData("./data/books.json", books);

  res.json(book);
};

const deleteBook = (req, res) => {
  const books = readData("./data/books.json");

  const id = Number(req.params.id);

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];

  writeData("./data/books.json", books);

  res.json({
    message: "Book deleted",
    book: deletedBook
  });
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};