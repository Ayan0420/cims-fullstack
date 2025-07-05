import { fork } from "child_process";
import * as https from "https";

const CHECK_INTERVAL = 5000; // 5 seconds

// FROM ELECTRON
// let SYNC_SCRIPT = "electron/db-sync/sync-service.js"; 
// let cwd = process.resourcesPath + "/app";

let SYNC_SCRIPT = "sync-service.js";
let cwd = __dirname;

let syncProcess = null;
let wasOffline = false;

// // Function to send connectivity status via IPC
// function sendStatus(offline: boolean) {
//   // This sends a message to the parent process (Electron main process)
//   if (process.send) {
//     process.send({ connectivity: offline ? "offline" : "online" });
//   }
// }


// (function watchWasOffline() {
//   let prevWasOffline = wasOffline;
//   console.log(`WATCHDOG: Initial status - ${prevWasOffline ? "==== OFFLINE ====" : "==== ONLINE ===="}`);
//   // sendStatus(wasOffline);
//   setInterval(() => {
//     if (prevWasOffline !== wasOffline) {
//       prevWasOffline = wasOffline;
//       console.log(`WATCHDOG: ${wasOffline ? "==== OFFLINE ====" : "==== ONLINE ===="}`);
//       // sendStatus(wasOffline);
//     }
//   }, 1000);
// })();



// Function to start the sync service as a child process.
function startSyncService() {
  syncProcess = fork(SYNC_SCRIPT, { 
    stdio: "inherit",
    cwd: cwd,
  });
  console.log(`WATCHDOG: Sync service started with PID: ${syncProcess.pid}`);

  syncProcess.on("exit", (code, signal) => {
    console.log(`WATCHDOG: Sync service exited (code: ${code}, signal: ${signal}).`);
    syncProcess = null;
  });

  syncProcess.on("message", (message) => {
    console.log("WATCHDOG: Message from sync service:", message); 
    // process.send?.(message); // Forward message to the parent (Electron main)
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
    const isOnline = await checkConnectivityViaHTTP();
    // console.log(isOnline)
    // console.log("WATCHDOG: ✅ Connectivity check passed: HTTPS request successful.");

    if (wasOffline) {
      wasOffline = false;
      restartSyncService();
    }
  } catch (err) {
    console.error("WATCHDOG: ❌ Connectivity check failed:", err.message);
    wasOffline = true;
  }
}

// Start the sync service initially.
startSyncService();

// Start periodic connectivity checks.
setInterval(checkConnectivity, CHECK_INTERVAL);
