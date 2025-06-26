// Moneybird API integration
import { fetch } from '@tauri-apps/plugin-http';

// Define types for Moneybird time entries
export interface TimeEntry {
  id: string;
  description: string;
  url?: string; // Optional field for URL
  time: string; // Duration or time spent
  contact: {
    id: string;
    company_name: string;
  };
  project: {
    id: string;
    name: string;
  };
  started_at: string;
  ended_at: string;
  user_id: string;
  billable?: boolean; // Optional field for billable status
}

// Define the base URL for the Moneybird API
const MONEYBIRD_API_BASE_URL = 'https://moneybird.com/api/v2';


/**
 * Helper function to create headers with the API token
 */
function createHeaders(apiToken: string): Headers {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${apiToken}`);
  headers.append('Content-Type', 'application/json');
  return headers;
}

/**
 * Fetch the last 20 time entries from Moneybird
 * 
 * @param apiToken The Moneybird API token
 * @param administrationId The Moneybird administration ID
 * @returns A promise that resolves to an array of time entries
 */
export async function fetchLastTimeEntries(apiToken?: string, administrationId?: string): Promise<TimeEntry[]> {
  // If API token or administration ID is not provided, return mock data
  if (!apiToken || !administrationId) {
    console.warn('API token or administration ID not provided, returning mock data');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  }

  try {
    const response = await fetch(
      `${MONEYBIRD_API_BASE_URL}/${administrationId}/time_entries?per_page=20`,
      {
        method: 'GET',
        headers: createHeaders(apiToken as string),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch time entries: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the API response to match our TimeEntry interface
    return data.map((entry: any) => ({
      id: entry.id,
      description: entry.description,
      time: calculateTimeSpent(entry.started_at, entry.ended_at),
      url: `https://moneybird.com/${administrationId}/time_entries/${entry.id}`, // Construct URL for the time entry
      contact: {
        id: entry.contact_id || '',
        company_name: entry.contact.company_name || 'Unknown Contact',
      },
      project: {
        id: entry.project_id || '',
        name: entry.project.name || 'Unknown Project',
      },
      started_at: entry.started_at,
      ended_at: entry.ended_at,
      billable: entry.billable || false, // Optional field
    }));
  } catch (error) {
    console.error('Error fetching time entries:', error);
    throw error;
  }
}

/**
 * Create a new time entry in Moneybird
 * 
 * @param apiToken The Moneybird API token
 * @param administrationId The Moneybird administration ID
 * @param entry The time entry data to create
 * @returns A promise that resolves to the created time entry
 */
export async function createTimeEntry(
  apiToken: string,
  administrationId: string,
  entry: Omit<TimeEntry, 'id'>
): Promise<TimeEntry> {
  if (!apiToken || !administrationId) {
    throw new Error('API token and administration ID are required');
  }

  try {
    // Transform our TimeEntry interface to match the Moneybird API format
    const requestData = {
      time_entry: {
        description: entry.description,
        started_at: entry.started_at.replace('T', ' ').replace('Z', ' UTC'),
        ended_at: entry.ended_at.replace('T', ' ').replace('Z', ' UTC'),
        contact_id: entry.contact.id,
        project_id: entry.project.id,
        user_id: entry.user_id,
        billable: entry.billable || false, // Optional field, default to false
      },
    };

    const response = await fetch(
      `${MONEYBIRD_API_BASE_URL}/${administrationId}/time_entries`,
      {
        method: 'POST',
        headers: createHeaders(apiToken),
        body: JSON.stringify(requestData),
      }
    );
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(`Failed to create time entry: ${response.statusText}`);
    }



    // Transform the API response to match our TimeEntry interface
    return {
      id: data.id,
      description: data.description,
      time: calculateTimeSpent(data.started_at, data.ended_at),
      contact: {
        id: data.contact.id,
        company_name: data.contact.contact_name,
      },
      project: {
        id: data.project.id,
        name: data.project.name,
      },
      started_at: data.started_at,
      ended_at: data.ended_at,
      user_id: data.user_id,
    };
  } catch (error) {
    console.error('Error creating time entry:', error);
    throw error;
  }
}

/**
 * Update an existing time entry in Moneybird
 * 
 * @param apiToken The Moneybird API token
 * @param administrationId The Moneybird administration ID
 * @param id The ID of the time entry to update
 * @param entry The time entry data to update
 * @returns A promise that resolves to the updated time entry
 */
export async function updateTimeEntry(
  apiToken: string,
  administrationId: string,
  id: string,
  entry: Partial<TimeEntry>
): Promise<TimeEntry> {
  if (!apiToken || !administrationId) {
    throw new Error('API token and administration ID are required');
  }

  try {
    // Transform our TimeEntry interface to match the Moneybird API format
    const requestData: any = { time_entry: {} };

    if (entry.description) requestData.time_entry.description = entry.description;
    if (entry.started_at) requestData.time_entry.started_at = entry.started_at;
    if (entry.ended_at) requestData.time_entry.ended_at = entry.ended_at;
    if (entry.contact?.id) requestData.time_entry.contact_id = entry.contact.id;
    if (entry.project?.id) requestData.time_entry.project_id = entry.project.id;

    const response = await fetch(
      `${MONEYBIRD_API_BASE_URL}/${administrationId}/time_entries/${id}`,
      {
        method: 'PATCH',
        headers: createHeaders(apiToken),
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update time entry: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the API response to match our TimeEntry interface
    return {
      id: data.id,
      description: data.description,
      time: calculateTimeSpent(data.started_at, data.ended_at),
      contact: {
        id: data.contact_id || '',
        company_name: data.contact_name || 'Unknown Contact',
      },
      project: {
        id: data.project_id || '',
        name: data.project_name || 'Unknown Project',
      },
      started_at: data.started_at,
      ended_at: data.ended_at,
      user_id: data.user_id,
    };
  } catch (error) {
    console.error('Error updating time entry:', error);
    throw error;
  }
}

/**
 * Helper function to calculate the time spent between two dates
 */
function calculateTimeSpent(startedAt: string, endedAt: string): string {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
}

// --- Fetch contacts from Moneybird API ---
export async function fetchContacts(apiToken?: string, administrationId?: string): Promise<{ id: string; company_name: string }[]> {
  if (!apiToken || !administrationId) {
    // Return mock contacts if not configured
    return [
      { id: "contact-1", company_name: "Client 1" },
      { id: "contact-2", company_name: "Client 2" },
      { id: "contact-3", company_name: "Client 3" },
    ];
  }
  try {
    const response = await fetch(
      `${MONEYBIRD_API_BASE_URL}/${administrationId}/contacts`,
      {
        method: 'GET',
        headers: createHeaders(apiToken),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((c: any) => ({ id: c.id, company_name: c.company_name }));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

// --- Fetch projects from Moneybird API ---
export async function fetchProjects(apiToken?: string, administrationId?: string): Promise<{ id: string; name: string }[]> {
  if (!apiToken || !administrationId) {
    // Return mock projects if not configured
    return [
      { id: "project-1", name: "Project 1" },
      { id: "project-2", name: "Project 2" },
      { id: "project-3", name: "Project 3" },
    ];
  }
  try {
    const response = await fetch(
      `${MONEYBIRD_API_BASE_URL}/${administrationId}/projects`,
      {
        method: 'GET',
        headers: createHeaders(apiToken),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((p: any) => ({ id: p.id, name: p.name }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// --- Fetch users from Moneybird API ---
export async function fetchUsers(apiToken?: string, administrationId?: string): Promise<{ id: string; name: string }[]> {
  if (!apiToken || !administrationId) {
    // Return mock users if not configured
    return [
      { id: "user-1", name: "User 1" },
      { id: "user-2", name: "User 2" },
      { id: "user-3", name: "User 3" },
    ];
  }
  try {
    const response = await fetch(
      `${MONEYBIRD_API_BASE_URL}/${administrationId}/users`,
      {
        method: 'GET',
        headers: createHeaders(apiToken),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((u: any) => ({ id: u.id, name: u.name }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
