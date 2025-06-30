import { create } from 'zustand';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useMoneybirdStore } from './moneybird';
import { TimeEntry } from '@/api/moneybird';

// Define the store state interface
interface TimerState {
  // Timer state
  isActive: boolean;
  startTime: string;
  endTime: string | null;
  timerInterval: NodeJS.Timeout | null;
  
  // Actions
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setEndTime: (time: string | null) => void;
  setStartTime: (time: string) => void;
  
  // Save time entry
  saveTimeEntry: (entry: Omit<TimeEntry, 'id'>) => Promise<boolean>;
}

// Create the Zustand store
export const useTimerStore = create<TimerState>((set, get) => ({
  // Initial state
  isActive: false,
  startTime: (() => {
    const now = new Date();
    return now.toTimeString().substring(0, 5); // Format: HH:MM
  })(),
  endTime: null,
  timerInterval: null,

  // update start time every minute
  setStartTime: (time: string) => {
    set({ startTime: time });
  },

  // Start the timer
  startTimer: () => {
    const { isActive } = get();
    
    // Don't start if already active
    if (isActive) return;
    
    // Create interval to update end time every second
    const interval = setInterval(() => {
      const now = new Date();
      set({ endTime: now.toTimeString().substring(0, 5) });
    }, 1000);
    
    // Update badge count
    (async () => {
      const win = await getCurrentWindow();
      win.setBadgeCount(1);
    })();
    
    set({ 
      isActive: true, 
      timerInterval: interval,
      endTime: null
    });
  },
  
  // Stop the timer
  stopTimer: () => {
    const { timerInterval } = get();
    
    // Clear the interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Update badge count
    (async () => {
      const win = await getCurrentWindow();
      win.setBadgeCount();
    })();
    
    // Set current time as end time
    const now = new Date();
    
    set({ 
      isActive: false, 
      timerInterval: null,
      endTime: now.toTimeString().substring(0, 5)
    });
  },
  
  // Reset the timer
  resetTimer: () => {
    const { timerInterval } = get();
    
    // Clear the interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Update badge count
    (async () => {
      const win = await getCurrentWindow();
      win.setBadgeCount();
    })();
    
    // Reset to initial state
    const now = new Date();
    set({ 
      isActive: false, 
      timerInterval: null,
      startTime: now.toTimeString().substring(0, 5),
      endTime: null
    });
  },
  
  // Set end time manually
  setEndTime: (time: string | null) => {
    set({ endTime: time });
  },

  
  // Save time entry
  saveTimeEntry: async (entry: Omit<TimeEntry, 'id'>): Promise<boolean> => {
    try {
      const addTimeEntry = useMoneybirdStore.getState().addTimeEntry;
      await addTimeEntry(entry);
      get().resetTimer();
      return true;
    } catch (error) {
      console.error('Failed to save time entry:', error);
      return false;
    }
  }
}));