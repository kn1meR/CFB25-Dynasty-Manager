// src/types/electron.d.ts
// Create this new file to extend the Window interface
interface ElectronAPI {
    getData: () => Promise<any>;
    saveData: (data: any) => Promise<void>;
  }
  
  declare global {
    interface Window {
      electronAPI?: ElectronAPI;
    }
  }
  
  export {};