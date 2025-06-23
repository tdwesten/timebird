import { useEffect } from "react";
import { useMoneybirdStore } from "@/stores/moneybird";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TimeEntriesTable() {
  const { 
    timeEntries, 
    isLoading, 
    error, 
    fetchTimeEntries, 
    apiToken, 
    administrationId 
  } = useMoneybirdStore();

  useEffect(() => {
    // Only fetch if we have API credentials
    if (apiToken && administrationId) {
      fetchTimeEntries();
    }
  }, [fetchTimeEntries, apiToken, administrationId]);

  if (isLoading) {
    return <div className="py-10 text-center">Loading time entries...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  if (!apiToken || !administrationId) {
    return (
      <div className="py-10 text-center">
        <p className="text-amber-600 mb-2">API not configured</p>
        <p className="text-gray-600">
          Please configure your Moneybird API token and administration ID in the settings.
        </p>
      </div>
    );
  }

  if (timeEntries.length === 0) {
    return (
      <div className="py-10 text-center text-gray-600">
        No time entries found. Create your first entry using the "New Time Entry" button.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Last 20 time entries from Moneybird</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Project</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.description}</TableCell>
              <TableCell>{entry.time}</TableCell>
              <TableCell>{entry.contact.company_name}</TableCell>
              <TableCell>{entry.project.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
