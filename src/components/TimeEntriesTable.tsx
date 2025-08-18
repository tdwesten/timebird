import { useEffect } from "react";
import { useMoneybirdStore } from "@/stores/moneybird";
import { useTimerStore } from "@/stores/timer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {EuroIcon, PlayCircleIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {TimeEntry} from "@/api/moneybird.ts";
import { useTranslation } from "react-i18next";

export function TimeEntriesTable() {
  const { t } = useTranslation();
  const { 
    timeEntries, 
    isLoading, 
    error, 
    fetchTimeEntries, 
    apiToken, 
    administrationId 
  } = useMoneybirdStore();
  
  const { startTimer } = useTimerStore();

  useEffect(() => {
    // Only fetch if we have API credentials
    if (apiToken && administrationId) {
      fetchTimeEntries();
    }
  }, [fetchTimeEntries, apiToken, administrationId]);

  if (isLoading) {
    return <div className="py-10 text-center">{t('timeEntries.loading')}</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  if (!apiToken || !administrationId) {
    return (
      <div className="py-10 text-center">
        <p className="text-amber-600 mb-2">{t('timeEntries.noApiTitle')}</p>
        <p className="text-gray-600">{t('timeEntries.noApiMessage')}</p>
      </div>
    );
  }

  if (timeEntries.length === 0) {
    return (
      <div className="py-10 text-center text-gray-600">
        {t('timeEntries.empty')}
      </div>
    );
  }

  function restartEvent(entry: TimeEntry) {
    return () => {
      console.log(`Restarting timer for entry: ${entry.description}`);
      startTimer(entry);
    };
  }

  return (
    <div className="rounded-md border bg-white">
      <Table className={` `}>
        <TableHeader>
          <TableRow>
            <TableHead>{t('timeEntries.headers.description')}</TableHead>
            <TableHead>{t('timeEntries.headers.time')}</TableHead>
            <TableHead><EuroIcon className={`w-4`}/></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className={'flex flex-col gap-2'}>
                  <div  className="font-blod text-base text-primary">
                    <a href={entry.url} target="_blank" rel="noopener noreferrer" className={`font-medium line-clamp-1`}>
                      {entry.description}
                    </a>
                  </div>
                  <div className={'flex gap-2 text-sm text-gray-500'}>
                    {entry.contact.company_name} / {entry.project.name} / <Button variant={ "link"} size={"sm"} className={`flex gap-1 items-center justify-center p-0 m-0 h-auto -mt-0.5 no-underline text-gray-500 hover:text-primary`} onClick={restartEvent(entry)}><PlayCircleIcon className={"w-4"} /> {t('timeEntries.continue')}</Button>
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
