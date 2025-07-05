// sync-service-v2.js
require("dotenv").config();
const { MongoClient } = require("mongodb");

let localClient, remoteClient;
// PROD
// const localDbName = "cims-db-prod-local";
// const remoteDbName = "cims-db-prod-remote";

// DEV
const localDbName = "cims-db-dev-local";
const remoteDbName = "cims-db-dev-remote";

let isConnected = false;

async function startSync() {
  // Connect to the local database
  try {
    localClient = new MongoClient(process.env.LOCAL_DB);
    console.log('conntecting to: ', process.env.LOCAL_DB)
    await localClient.connect();
    console.log("SYNC SERVICE: Connected to local database.");
  } catch (err) {
    console.error("SYNC SERVICE: Failed to connect to local database:", err);
    process.exit(1); // local DB is required
  }

  // Attempt connection to the remote database
  try {
    remoteClient = new MongoClient(process.env.REMOTE_DB, {
      serverSelectionTimeoutMS: 5000, // 5 seconds
    });
    console.log('conntecting to: ', process.env.REMOTE_DB)
    await remoteClient.connect();
    console.log("SYNC SERVICE: Connected to remote database.");
    isConnected = true;
  } catch (err) {
    console.error("SYNC SERVICE: Could not connect to remote database:", err.message);
    isConnected = false;
  }

  // Retrieve database handles
  const localDb = localClient.db(localDbName);
  const remoteDb = isConnected ? remoteClient.db(remoteDbName) : null;


  // Get collections
  const localJobsCollection = localDb.collection("jobs");
  const localCustomersCollection = localDb.collection("customers");
  const localCountersCollection = localDb.collection("counters");
  const syncQueue = localDb.collection("sync_queue");

  console.log("SYNC SERVICE: O_O Watching for changes in the local database...");

  // Set up change stream watchers for local collections
  watchCollection(localJobsCollection, "jobs", syncQueue, remoteDb);
  watchCollection(localCustomersCollection, "customers", syncQueue, remoteDb);
  watchCollection(localCountersCollection, "counters", syncQueue, remoteDb);

  // Sync any pending changes if remote is connected
  if (isConnected) {
    await syncPendingChanges(syncQueue, remoteDb);
  } else {
    console.log("SYNC SERVICE: Running in offline mode. Changes will be queued until remote is available.");
  }
}



// Function to watch a collection for changes
function watchCollection(localCollection, collectionName, syncQueue, remoteDb) {
  const changeStream = localCollection.watch();

  changeStream.on("change", async (change) => {
    console.log(`SYNC SERVICE: Change detected on ${collectionName} collection!`);
    const { _id } = change.documentKey;

    try {
      if (["insert", "update"].includes(change.operationType)) {
        const doc = await localCollection.findOne({ _id });
        await saveChangeLocally(syncQueue, collectionName, _id, doc);
        await syncToRemote(remoteDb, collectionName, _id, doc);
        console.log(`SYNC SERVICE: Synced ${collectionName} change to remote database. [${change.operationType}] ${_id}`);
      } else if (change.operationType === "delete") {
        await saveChangeLocally(syncQueue, collectionName, _id, null);
        await deleteFromRemote(remoteDb, collectionName, _id);
        console.log(`SYNC SERVICE: Synced ${collectionName} deletion to remote database. [${change.operationType}] ${_id}`);
      }
    } catch (err) {
      console.error("SYNC SERVICE: No Synchronization, Error massage:", err.message)
    }
  });

  changeStream.on("error", (err) => {
    console.error(`SYNC SERVICE: Change stream error on ${collectionName}:`, err);
  });
}

// Function to save changes locally in the sync queue
async function saveChangeLocally(syncQueue, collectionName, _id, doc) {
  if (doc) {
    await syncQueue.updateOne({ _id, collectionName }, { $set: { _id, collectionName, doc } }, { upsert: true });
    console.log("SYNC SERVICE: Save/Update change added to Sync Queue!")
  } else {
    await syncQueue.updateOne({ _id, collectionName }, { $set: { _id, collectionName, doc:null } }, { upsert: true });
    console.log("SYNC SERVICE: Delete change added to Sync Queue!")
  }
}

// Function to sync pending changes from the queue to the remote database
async function syncPendingChanges(syncQueue, remoteDb) {
  const pendingChanges = await syncQueue.find().toArray();
  sendSyncStatus(0, "SYNC SERVICE: Syncing to remote DB...");
  for (const { _id, collectionName, doc } of pendingChanges) {
    const remoteCollection = remoteDb.collection(collectionName);
    if (doc) {
      await remoteCollection.updateOne({ _id }, { $set: doc }, { upsert: true });
    } else {
      await remoteCollection.deleteOne({ _id });
    }
    await syncQueue.deleteOne({ _id, collectionName });
  }

  console.log(`SYNC SERVICE: SYNCED ALL ${pendingChanges.length} pending changes.`);
  sendSyncStatus(1,`SYNC SERVICE: Synced ${pendingChanges.length} changes to remote DB.`);
}

// Function to sync a change to the remote database
async function syncToRemote(remoteDb, collectionName, _id, doc) {
  const remoteCollection = remoteDb.collection(collectionName);
  await remoteCollection.updateOne({ _id }, { $set: doc }, { upsert: true });
  await removeFromSyncQueue(collectionName, _id);
}

// Function to delete a document from the remote database
async function deleteFromRemote(remoteDb, collectionName, _id) {
  const remoteCollection = remoteDb.collection(collectionName);
  await remoteCollection.deleteOne({ _id });
  await removeFromSyncQueue(collectionName, _id);
}

// Function to remove a change from the sync queue
async function removeFromSyncQueue(collectionName, _id) {
  const localDb = localClient.db(localDbName);
  const syncQueue = localDb.collection("sync_queue");
  await syncQueue.deleteOne({ _id, collectionName });
}

// Function to send connectivity status via IPC
function sendSyncStatus(status, message) {
  // This sends a message to the parent process (Electron main process)
  if (process.send) {
    process.send({ syncStatus: status, message });
  }
}

// Start the synchronization process
startSync();
