const os = require("os");
const fs = require("fs");
const { exec } = require("child_process");

function getTopProcessCommand() {
  const platform = os.platform();
  if (platform === "win32") {
    return "powershell \"Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }\"";
  } else if (platform === "linux") {
    return "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1";
  } else {
    throw new Error("Unsupported operating system");
  }
}

function logToFile(logPath, message) {
  fs.appendFileSync(logPath, message + "\n");
}

function getCurrentUnixTime() {
  return Math.floor(Date.now() / 1000);
}

function main() {
  const refreshRate = 100;
  const logFilePath = "activityMonitor.log";

  try {
    let lastLogTime = 0;
    setInterval(() => {
      exec(getTopProcessCommand(), (error, stdout) => {
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
  } catch (error) {
    console.error(error);
  }
}

main();
