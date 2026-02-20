import { Show } from "../utils/ConditionalRendering"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { isElectronEnvironment } from "../utils/electron";


const OfflineBanner = () => {
  
  const [isOnline, setIsOnline] = useState(() => {
    // Retrieve the last known state from localStorage
    if(!localStorage.getItem("isOnline")) return true;
    return localStorage.getItem("isOnline") === "true";
  });
  
  useEffect(() => {
    const syncBrowserOnlineStatus = () => {
      const onlineStatus = navigator.onLine;
      setIsOnline(onlineStatus);
      localStorage.setItem("isOnline", onlineStatus.toString());
    };

    const applyConnectivityStatus = (status: string) => {
      const onlineStatus = status === "online";
      setIsOnline(onlineStatus);
      localStorage.setItem("isOnline", onlineStatus.toString());
      toast(
        "Connectivity: " + ` ${onlineStatus ? "🟢" : "🔴"} ` + status.toUpperCase(),
        { duration: 5000 }
      );
    };

    const eventSource = new EventSource("/sync/events");
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          type?: string;
          connectivity?: string;
          syncStatus?: number;
          message?: string;
        };

        if (payload.type === "connectivity" && payload.connectivity) {
          applyConnectivityStatus(payload.connectivity);
        }

        if (payload.type === "sync" && payload.syncStatus === 0) {
          toast.loading(payload.message ?? "Syncing to remote DB...", { duration: Infinity });
        }
        if (payload.type === "sync" && payload.syncStatus === 1) {
          toast.dismiss();
          toast.success(payload.message ?? "Sync completed.", { duration: 10000 });
        }
      } catch {
        // Ignore malformed events
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    if (isElectronEnvironment()) {
      return () => eventSource.close();
    }

    const handleOnline = () => {
      syncBrowserOnlineStatus();
      toast("Connectivity: 🟢 ONLINE", { duration: 5000 });
    };

    const handleOffline = () => {
      syncBrowserOnlineStatus();
      toast("Connectivity: 🔴 OFFLINE", { duration: 5000 });
    };

    syncBrowserOnlineStatus();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      eventSource.close();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  return (
    <>
      <Show when={!isOnline}>
        <div className="fixed-top text-center fw-bold text-sm" style={{zIndex: 9998, color: "red", backgroundColor: "black"}}>
          OFFLINE MODE
        </div>
      </Show>
    </>
  )
}

export default OfflineBanner
