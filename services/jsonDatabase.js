const fs = require("fs");

const readData = (filePath) => {
  const data = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(data);
};

const writeData = (filePath, data) => {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );
};

module.exports = {
  readData,
  writeData
};