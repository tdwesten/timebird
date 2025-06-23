// Moneybird API integration

// Define types for Moneybird time entries
export interface TimeEntry {
  id: string;
  description: string;
  time: string; // Duration or time spent
  contact: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  started_at: string;
  ended_at: string;
}

// Mock data for development purposes
// In a real implementation, this would be replaced with actual API calls
const mockTimeEntries: TimeEntry[] = Array.from({ length: 20 }, (_, i) => ({
  id: `entry-${i + 1}`,
  description: `Time entry ${i + 1} description`,
  time: `${Math.floor(Math.random() * 8) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  contact: {
    id: `contact-${Math.floor(Math.random() * 5) + 1}`,
    name: `Client ${Math.floor(Math.random() * 5) + 1}`,
  },
  project: {
    id: `project-${Math.floor(Math.random() * 3) + 1}`,
    name: `Project ${Math.floor(Math.random() * 3) + 1}`,
  },
  started_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  ended_at: new Date().toISOString(),
}));

/**
 * Fetch the last 20 time entries from Moneybird
 * 
 * In a real implementation, this would make an actual API call to Moneybird
 * For now, we're using mock data
 */
export async function fetchLastTimeEntries(): Promise<TimeEntry[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  // In a real implementation, this would fetch data from the Moneybird API
  return mockTimeEntries;
}