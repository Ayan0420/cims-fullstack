// src/electronAPI.d.ts

interface PromptOptions {
    title: string;
    label: string;
    value: string;
    inputAttrs: {
      type: string;
    };
    type: string;
  }
  
  interface ElectronAPI {
    prompt: (options: PromptOptions) => Promise<string | null>;
    closeWindow: () => void;
    closeAndRefresh: () => void;
    refreshMain: () => void;
    onConnectivityStatus: (callback: (status: string) => void) => void;
    onCheckSyncStatus: (callback: ({syncStatus: number, message: string}) => void) => void;
  }
  
  // Augment the global Window interface
  declare global {
    interface Window {
      electronAPI: ElectronAPI;
    }
  }
  
  export {}; // This ensures the file is treated as a module
  