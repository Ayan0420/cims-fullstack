import { fork } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const CHECK_INTERVAL = 5000; // 5 seconds

// FROM ELECTRON
// let SYNC_SCRIPT = "electron/db-sync/sync-service.js"; 
// let cwd = process.resourcesPath + "/app";

const cwd = __dirname;

let syncProcess = null;
let wasOffline = false;

function sendStatus(offline: boolean) {
  if (process.send) {
    process.send({ connectivity: offline ? "offline" : "online" });
  }
}

(function watchWasOffline() {
  let prevWasOffline = wasOffline;
  sendStatus(wasOffline);
  setInterval(() => {
    if (prevWasOffline !== wasOffline) {
      prevWasOffline = wasOffline;
      sendStatus(wasOffline);
    }
  }, 1000);
})();



// Function to start the sync service as a child process.
function startSyncService() {
  const syncScriptJs = path.join(cwd, "sync-service.js");
  const syncScriptTs = path.join(cwd, "sync-service.ts");
  const syncScriptPath = fs.existsSync(syncScriptJs) ? syncScriptJs : syncScriptTs;
  const execArgv = syncScriptPath.endsWith(".ts") ? ["-r", "ts-node/register/transpile-only"] : undefined;

  syncProcess = fork(syncScriptPath, {
    stdio: "inherit",
    cwd: cwd,
    execArgv,
  });
  console.log(`WATCHDOG: Sync service started with PID: ${syncProcess.pid}`);

  syncProcess.on("exit", (code, signal) => {
    console.log(`WATCHDOG: Sync service exited (code: ${code}, signal: ${signal}).`);
    syncProcess = null;
  });

  syncProcess.on("message", (message) => {
    console.log("WATCHDOG: Message from sync service:", message); 
    process.send?.(message);
  });
}

// Function to restart the sync service.
function restartSyncService() {
    // console.log("WATCHDOG: ✅ Connection is up!");
  if (syncProcess) {
    console.log("WATCHDOG: Restarting sync service to refresh DNS cache...");
    syncProcess.kill(); // Kill the process; then restart it.
    setTimeout(startSyncService, 2000);
  } else {
    startSyncService();
  }
}

// Alternative connectivity check using HTTPS.
function checkConnectivityViaHTTP() {
  return new Promise((resolve, reject) => {
    
    const req = https.get("https://www.google.com", (res) => {
      // Consider any 2xx status code as a success.
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(true);
      } else {
        reject(new Error(`WATCHDOG: HTTP status code ${res.statusCode}`));
      }
      res.resume();
    });
    req.on("error", (err) => {
      reject(err);
    });
    req.setTimeout(5000, () => {
      req.destroy(new Error("WATCHDOG: Request timed out"));
    });
  });
}

// Periodic connectivity check function.
async function checkConnectivity() {
  try {
    // Use HTTPS connectivity check instead of DNS.
    await checkConnectivityViaHTTP();

    if (wasOffline) {
      wasOffline = false;
      console.log("WATCHDOG: ✅ Connectivity restored.");
      restartSyncService();
    }
  } catch (err) {
    if (!wasOffline) {
      console.error("WATCHDOG: ❌ Connectivity check failed:", err.message);
    }
    wasOffline = true;
  }
}

// Start the sync service initially.
startSyncService();

// Start periodic connectivity checks.
setInterval(checkConnectivity, CHECK_INTERVAL);
