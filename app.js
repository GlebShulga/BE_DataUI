const fs = require("fs");
const { exec } = require("child_process");

function getTopProcessCommand() {
  if (process.platform === "win32") {
    return "powershell \"Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }\"";
  } else if (process.platform === "linux") {
    return "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1";
  } else {
    throw new Error("Unsupported operating system");
  }
}

async function logToFile(logPath, message) {
  try {
    await fs.promises.appendFile(logPath, message + "\n");
  } catch (error) {
    console.error("Error writing to the log file:", error);
  }
}

function getCurrentUnixTime() {
  return Math.floor(Date.now() / 1000);
}

function main() {
  const refreshRate = 100;
  const logFilePath = "activityMonitor.log";
  let topProcessCommand;
  try {
    (async () => {
      let lastLogTime = 0;
      topProcessCommand = getTopProcessCommand();
      setInterval(() => {
        exec(topProcessCommand, (error, stdout) => {
          if (error) {
            console.error(error);
            return;
          }

          const processInfo = stdout.trim();
          const currentTime = getCurrentUnixTime();
          const logMessage = `${currentTime} : ${processInfo}`;

          process.stdout.write(`\r${processInfo}`);

          if (currentTime - lastLogTime >= 60) {
            logToFile(logFilePath, `${logMessage}`);
            lastLogTime = currentTime;
          }
        });
      }, refreshRate);
    })();
  } catch (error) {
    console.error(error);
  }
}

main();
