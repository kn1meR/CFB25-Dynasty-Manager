// src/utils/storage.ts
// Update the getData and saveData functions
export async function getData() {
  if (typeof window !== 'undefined' && 'electronAPI' in window) {
    return window.electronAPI!.getData();
  } else {
    // Fallback to localStorage for web version
    const data = localStorage.getItem('dynastyData');
    return data ? JSON.parse(data) : {};
  }
}

export async function saveData(data: any) {
  if (typeof window !== 'undefined' && 'electronAPI' in window) {
    await window.electronAPI!.saveData(data);
  } else {
    // Fallback to localStorage for web version
    localStorage.setItem('dynastyData', JSON.stringify(data));
  }
}