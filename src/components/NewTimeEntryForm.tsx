import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMoneybirdStore } from "@/stores/moneybird";
import { useTimerStore } from "@/stores/timer";
import { TimeEntry, fetchContacts, fetchProjects } from "@/api/moneybird";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {Clock2Icon, PlayIcon, StopCircleIcon, Trash2} from "lucide-react";

// --- Add types for Contact and Project ---
interface Contact {
  id: string;
  company_name: string;
}
interface Project {
  id: string;
  name: string;
}

export function NewTimeEntryForm() {
  const { apiToken, administrationId, userId: savedUserId } = useMoneybirdStore();
  const { 
    isActive: timerActive, 
    startTime, 
    endTime, 
    startTimer, 
    stopTimer, 
    resetTimer, 
    setStartTime, 
    setEndTime, 
    saveTimeEntry 
  } = useTimerStore();

  const [description, setDescription] = useState("");
  const [contactId, setContactId] = useState("");
  const [contactName, setContactName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDateSelectors, setShowDateSelectors] = useState(false);
  const [billable, setBillable] = useState(false);

  // --- Add state for contacts and projects ---
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const resetForm = () => {
    setDescription("");
    setContactId("");
    setContactName("");
    setProjectId("");
    setProjectName("");
    setStartDate("");
    setEndDate("");
    setError(null);
    setBillable(false);
    resetTimer(); // Use timer store's resetTimer function
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Additional validations specific to form submission
    if (!description) {
      setError("Description is required");
      return;
    }

    if (!contactId || !contactName) {
      setError("Contact information is required");
      return;
    }

    if (!projectId || !projectName) {
      setError("Project information is required");
      return;
    }

    if (!startTime || !endTime) {
      setError("Start and end times are required");
      return;
    }

    if (showDateSelectors && (!startDate || !endDate)) {
      setError("Start and end dates are required when date selectors are shown");
      return;
    }

    // Use the common save entry logic
    await handleSaveEntry();
  };

  // Check if API is configured
  const isApiConfigured = Boolean(apiToken && administrationId);

  // --- Fetch contacts and projects from API ---
  useEffect(() => {
    async function loadOptions() {
      if (!apiToken || !administrationId) return;
      setLoadingOptions(true);
      try {
        const [contactsData, projectsData] = await Promise.all([
          fetchContacts(apiToken, administrationId),
          fetchProjects(apiToken, administrationId),
        ]);
        setContacts(contactsData);
        setProjects(projectsData);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, [apiToken, administrationId]);

  // Timer-related useEffect hooks are now handled by the timer store

  const handleTimerClick = async () => {
    if (!timerActive) {
      // Start timer
      startTimer();
    } else {
      // Stop timer and save entry
      stopTimer();
      await handleSaveEntry();
    }
  };

  const handleSaveEntry = async () => {
    // Validate form
    if (!description || !contactId || !contactName || !projectId || !projectName || !startTime) {
      setError("All fields are required");
      return false;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Create start and end datetime strings
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const startedAt = showDateSelectors && startDate 
        ? new Date(`${startDate}T${startTime}`).toISOString() 
        : new Date(`${today}T${startTime}`).toISOString();

      const endedAt = showDateSelectors && endDate && endTime
        ? new Date(`${endDate}T${endTime}`).toISOString()
        : endTime 
          ? new Date(`${today}T${endTime}`).toISOString()
          : now.toISOString();

      // Create the time entry object
      const newEntry: Omit<TimeEntry, "id"> = {
        description,
        contact: {
          id: contactId,
          company_name: contactName,
        },
        project: {
          id: projectId,
          name: projectName,
        },
        started_at: startedAt,
        ended_at: endedAt,
        time: "",
        user_id: savedUserId,
        billable,
      } as any;

      // Save the time entry using the timer store
      const success = await saveTimeEntry(newEntry);

      if (success) {
        resetForm();
        return true;
      } else {
        setError("Failed to create time entry. Please try again.");
        return false;
      }
    } catch (err) {
      console.error("Failed to create time entry:", err);
      setError("Failed to create time entry. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time input to HH:MM (24h) on change
  function formatTimeInput(value: string) {
    // Remove all non-digits and colons
    let v = value.replace(/[^0-9:]/g, "");
    // If only 3 or 4 digits, insert colon
    if (/^\d{3,4}$/.test(v)) {
      v = v.padStart(4, "0");
      v = v.slice(0, 2) + ":" + v.slice(2, 4);
    }
    // If already has colon, ensure only two digits before and after
    if (/^\d{2}:\d{2}$/.test(v)) {
      return v;
    }
    // If not valid, return as is (let user keep typing)
    return v;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {timerActive && (
        <div className="fixed left-0 top-0 w-full h-2 z-50">
          <div className="h-full w-full bg-red-500 animate-pulse" />
        </div>
      )}

      {!isApiConfigured && (
        <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded mb-4">
          Please configure your Moneybird API token and administration ID in the settings.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you work on?"
          disabled={!isApiConfigured || isSubmitting}
          autoFocus={true}
          tabIndex={0}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 relative">
          <Label htmlFor="contactId" className="text-sm font-medium">
            Contact
          </Label>
          <Combobox
            options={contacts.map((c) => ({ value: c.id, label: c.company_name }))}
            value={contactId}
            onChange={(opt) => {
              setContactId(opt.value);
              setContactName(opt.label);
            }}
            placeholder={loadingOptions ? "Loading..." : "Select contact"}
            disabled={!isApiConfigured || isSubmitting || loadingOptions}
            inputId="contactId"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectId" className="text-sm font-medium">
            Project
          </Label>
          <Combobox
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            value={projectId}
            onChange={(opt) => {
              setProjectId(opt.value);
              setProjectName(opt.label);
            }}
            placeholder={loadingOptions ? "Loading..." : "Select project"}
            disabled={!isApiConfigured || isSubmitting || loadingOptions}
            inputId="projectId"
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 relative">
          <Label htmlFor="startTime" className="text-sm font-medium">
            Start Time
          </Label>
          <div className="relative">
            <Input
              id="startTime"
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(formatTimeInput(e.target.value))}
              disabled={!isApiConfigured || isSubmitting || timerActive}
              placeholder="00:00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Clock2Icon className={`w-5 h-5 text-gray-400`} />
            </span>
          </div>
        </div>
        <div className="space-y-2 relative">
          <Label htmlFor="endTime" className="text-sm font-medium">
            End Time
          </Label>
          <div className="relative">
            <Input
              id="endTime"
              type="text"
              value={endTime ?? ""}
              onChange={(e) => setEndTime(formatTimeInput(e.target.value))}
              disabled={!isApiConfigured || isSubmitting || timerActive}
              placeholder={timerActive ? "Running..." : "00:00"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Clock2Icon className={`w-5 h-5 text-gray-400`} />
            </span>
            {endTime && !timerActive && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setEndTime(null)}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1"
                tabIndex={-1}
                title="Clear end time"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            )}
          </div>
        </div>
      </div>
      {showDateSelectors && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!isApiConfigured || isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!isApiConfigured || isSubmitting}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 mt-2">
          <Input
            type="checkbox"
            id="billable"
            checked={billable}
            onChange={e => setBillable(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={!isApiConfigured || isSubmitting}
          />
          <Label htmlFor="billable" className="text-sm font-medium">
            Billable
          </Label>
        </div>
      </div>



      <div className="flex justify-between gap-2 pt-4 items-center border-t">
        <div className="flex items-center space-x-2 mt-2">
          <Input
            type="checkbox"
            id="showDateSelectors"
            checked={showDateSelectors}
            onChange={(e) => setShowDateSelectors(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={!isApiConfigured || isSubmitting}
          />
          <Label htmlFor="showDateSelectors" className="text-sm font-medium text-gray-500">
            Show date selectors
          </Label>
        </div>
        <div className={`flex items-center space-x-2`}>
          {endTime && !timerActive ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex items-center justify-center"
                title="Reset form"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                onClick={handleSaveEntry}
                disabled={!isApiConfigured || isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex items-center justify-center"
                title="Reset form"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                onClick={handleTimerClick}
                disabled={!isApiConfigured || isSubmitting}
                className={timerActive ? "bg-red-500 hover:bg-red-600 text-white" : ""}
              >
                {!timerActive ? (
                  <>
                    <PlayIcon className={`h-4 -ml-1.5`} />
                    Start timer
                  </>
                  ) : (
                    <>
                      <StopCircleIcon className={`h-4 -ml-1.5`} />
                      Stop timer
                    </>
                  )
                }
              </Button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
