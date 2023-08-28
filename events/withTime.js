const EventEmitter = require("events");
const https = require("https");

class WithTime extends EventEmitter {
  async execute(asyncFunction, ...args) {
    try {
      this.emit("start");
      console.log("Execution started.");

      const startTime = new Date();

      const result = await asyncFunction(...args);

      const endTime = new Date();
      const executionTime = endTime - startTime;

      this.emit("end");
      console.log("Execution finished.");

      this.emit("data", result);
      console.log("Data emitted:", result);

      console.log("Time taken:", executionTime, "ms");
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

const withTime = new WithTime();

withTime.on("start", () => console.log("About to execute"));
withTime.on("end", () => console.log("Done with execute"));

async function fetchDataFromUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        resolve(JSON.parse(data));
      });

      response.on("error", (error) => {
        reject(error);
      });
    });
  });
}

withTime.execute(
  fetchDataFromUrl,
  "https://jsonplaceholder.typicode.com/posts/1"
);
