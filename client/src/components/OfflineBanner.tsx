import { Show } from "../utils/ConditionalRendering"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


const OfflineBanner = () => {
  
  const [isOnline, setIsOnline] = useState(() => {
    // Retrieve the last known state from localStorage
    if(!localStorage.getItem("isOnline")) return true;
    return localStorage.getItem("isOnline") === "true";
  });
  
  useEffect(() => {
    window.electronAPI.onConnectivityStatus((status) => {
      // console.log("Connectivity status changed:", status);
  
      const onlineStatus = status === "online";
      setIsOnline(onlineStatus);
      localStorage.setItem("isOnline", onlineStatus.toString()); // Store in localStorage
 
      toast(
        "Connectivity: " + ` ${onlineStatus ? "🟢" : "🔴"} ` + status.toUpperCase(),
        { duration: 5000 }
      );
    });

    window.electronAPI.onCheckSyncStatus((status: {syncStatus: number, message: string})=> {
      if(status.syncStatus === 0) toast.loading(status.message, { duration: Infinity });
      if(status.syncStatus === 1) {
        toast.dismiss(); // Remove loading toast
        toast.success(status.message, { duration: 10000 });
      }
    });
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