import { useEffect, useState } from "react";
import { fetchLastTimeEntries, type TimeEntry } from "@/api/moneybird";
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
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTimeEntries() {
      try {
        setLoading(true);
        const entries = await fetchLastTimeEntries();
        setTimeEntries(entries);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch time entries:", err);
        setError("Failed to load time entries. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadTimeEntries();
  }, []);

  if (loading) {
    return <div className="py-10 text-center">Loading time entries...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
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
              <TableCell>{entry.contact.name}</TableCell>
              <TableCell>{entry.project.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}