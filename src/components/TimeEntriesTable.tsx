import { useEffect } from "react";
import { useMoneybirdStore } from "@/stores/moneybird";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {EuroIcon} from "lucide-react";

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
        No time entries found... Time to get tracking!
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Time</TableHead>
            <TableHead><EuroIcon className={`w-4`}/></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className={'flex flex-col gap-2'}>
                  <div  className="font-blod text-base text-primary">
                    <a href={entry.url} target="_blank" rel="noopener noreferrer" className={`font-medium`}>
                      {entry.description}
                    </a>
                  </div>
                  <div className={'flex gap-2 text-sm text-gray-500'}>
                    {entry.contact.company_name} / {entry.project.name}
                  </div>
                </div>
              </TableCell>
              <TableCell>{entry.time}</TableCell>
              <TableCell>{entry.billable}{entry.billable ? <EuroIcon className={`w-4`}/> : null}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
