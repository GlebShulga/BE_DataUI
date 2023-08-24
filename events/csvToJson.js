const fs = require("fs");
const csv = require("csvtojson");
const path = require("path");

const csvFilePath = path.join(__dirname, "csvdirectory", "csvfile.csv");
const txtFilePath = path.join(__dirname, "output.txt");

const csvToJson = async () => {
  try {
    const readStream = fs.createReadStream(csvFilePath, "utf-8");
    const writeStream = fs.createWriteStream(txtFilePath, { flags: "a" });

    const jsonArray = await csv().fromStream(readStream);

    jsonArray.forEach((data) => {
      const { Book, Author, Price } = data;
      const jsonObject = {
        book: Book,
        author: Author,
        price: parseFloat(Price),
      };
      const jsonString = JSON.stringify(jsonObject) + "\n";
      writeStream.write(jsonString);
    });

    console.log("CSV to JSON conversion completed.");

    writeStream.on("error", (error) => {
      console.error("Write error:", error.message);
    });
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};

csvToJson();
