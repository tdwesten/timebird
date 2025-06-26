import { create } from 'zustand';
import { load } from '@tauri-apps/plugin-store';
import { TimeEntry, fetchLastTimeEntries, createTimeEntry, updateTimeEntry } from '@/api/moneybird';

// Define the store state interface
interface MoneybirdState {
  // API configuration
  apiToken: string;
  administrationId: string;

  // Time entries data
  timeEntries: TimeEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setApiToken: (token: string) => Promise<void>;
  setAdministrationId: (id: string) => Promise<void>;
  fetchTimeEntries: () => Promise<void>;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => Promise<void>;
  updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => Promise<void>;

  // Store initialization
  initialized: boolean;
  initialize: () => Promise<void>;

  // User ID
  userId: string;
  setUserId: (id: string) => Promise<void>;
}

// Variable to hold the store instance
let settingsStore: any = null;

// Create the Zustand store
export const useMoneybirdStore = create<MoneybirdState>((set, get) => ({
  // Initial state
  apiToken: '',
  administrationId: '',
  timeEntries: [],
  isLoading: false,
  error: null,
  initialized: false,
  userId: '',

  // Initialize the store by loading settings from Tauri store
  initialize: async () => {
    try {
      // Current environment, so we can have a development store and a production store
      const storeFileName = process.env.NODE_ENV === 'development' ? 'dev-store.json' : 'store.json';

      settingsStore = await load(storeFileName, { autoSave: false });

      // Load settings from the store
      const apiToken = await settingsStore.get('apiToken') as string || '';
      const administrationId = await settingsStore.get('administrationId') as string || '';
      const userId = await settingsStore.get('userId') as string || '';
      set({
        apiToken, 
        administrationId,
        userId,
        initialized: true
      });

      // If we have both API token and administration ID, fetch time entries
      if (apiToken && administrationId) {
        get().fetchTimeEntries();
      }
    } catch (error) {
      console.error('Failed to initialize Moneybird store:', error);
      set({ error: 'Failed to load settings', initialized: true });
    }
  },

  // Set API token and save to store
  setApiToken: async (token: string) => {
    try {
      if (!settingsStore) {
        throw new Error('Store not initialized');
      }
      await settingsStore.set('apiToken', token);
      await settingsStore.save();
      set({ apiToken: token });
    } catch (error) {
      console.error('Failed to save API token:', error);
      set({ error: 'Failed to save API token' });
    }
  },

  // Set administration ID and save to store
  setAdministrationId: async (id: string) => {
    try {
      if (!settingsStore) {
        throw new Error('Store not initialized');
      }
      await settingsStore.set('administrationId', id);
      await settingsStore.save();
      set({ administrationId: id });
    } catch (error) {
      console.error('Failed to save administration ID:', error);
      set({ error: 'Failed to save administration ID' });
    }
  },

  // Set user ID and save to store
  setUserId: async (id: string) => {
    try {
      if (!settingsStore) {
        throw new Error('Store not initialized');
      }
      await settingsStore.set('userId', id);
      await settingsStore.save();
      set({ userId: id });
    } catch (error) {
      console.error('Failed to save user ID:', error);
      set({ error: 'Failed to save user ID' });
    }
  },

  // Fetch time entries from the API
  fetchTimeEntries: async () => {
    const { apiToken, administrationId } = get();

    // Check if we have the required configuration
    if (!apiToken || !administrationId) {
      set({ error: 'API token and administration ID are required' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const entries = await fetchLastTimeEntries(apiToken, administrationId);
      set({ timeEntries: entries, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch time entries:', error);
      set({ 
        error: 'Failed to fetch time entries', 
        isLoading: false 
      });
    }
  },

  // Add a new time entry
  addTimeEntry: async (entry: Omit<TimeEntry, 'id'>) => {

    console.log('Adding new time entry:', entry);
    const { apiToken, administrationId } = get();

    // Check if we have the required configuration
    if (!apiToken || !administrationId) {
      set({ error: 'API token and administration ID are required' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const newEntry = await createTimeEntry(apiToken, administrationId, entry);
      set(state => ({ 
        timeEntries: [newEntry, ...state.timeEntries], 
        isLoading: false 
      }));
    } catch (error) {
      console.error('Failed to create time entry:', error);
      set({ 
        error: 'Failed to create time entry', 
        isLoading: false 
      });
    }
  },

  // Update an existing time entry
  updateTimeEntry: async (id: string, entry: Partial<TimeEntry>) => {
    const { apiToken, administrationId } = get();

    // Check if we have the required configuration
    if (!apiToken || !administrationId) {
      set({ error: 'API token and administration ID are required' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const updatedEntry = await updateTimeEntry(apiToken, administrationId, id, entry);
      set(state => ({ 
        timeEntries: state.timeEntries.map(e => e.id === id ? updatedEntry : e), 
        isLoading: false 
      }));
    } catch (error) {
      console.error('Failed to update time entry:', error);
      set({ 
        error: 'Failed to update time entry', 
        isLoading: false 
      });
    }
  }
}));
