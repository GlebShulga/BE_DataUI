const EventEmitter = require("events");
const https = require("https");

class WithTime extends EventEmitter {
  async fetchAndProcessData(url) {
    try {
      this.emit("start");
      console.log("Execution started.");

      const startTime = new Date();

      const response = await this.fetchData(url);
      const jsonData = JSON.parse(response);

      const endTime = new Date();
      const executionTime = endTime - startTime;

      this.emit("end");
      console.log("Execution finished.");

      this.emit("data", jsonData);
      console.log("Data emitted:", jsonData);

      console.log("Time taken:", executionTime, "ms");
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  fetchData(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          resolve(data);
        });

        response.on("error", (error) => {
          reject(error);
        });
      });
    });
  }
}

const withTime = new WithTime();

withTime.on("begin", () => console.log("About to execute"));
withTime.on("end", () => console.log("Done with execute"));

withTime.fetchAndProcessData("https://jsonplaceholder.typicode.com/posts/1");

console.log(withTime.rawListeners("end"));
