import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useMoneybirdStore } from "@/stores/moneybird";
import { TimeEntry } from "@/api/moneybird";

export function NewTimeEntryForm() {
  const { addTimeEntry, apiToken, administrationId } = useMoneybirdStore();
  const [description, setDescription] = useState("");
  const [contactId, setContactId] = useState("");
  const [contactName, setContactName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().substring(0, 5); // Format: HH:MM
  });
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().substring(0, 5); // Format: HH:MM
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDateSelectors, setShowDateSelectors] = useState(false);

  const resetForm = () => {
    setDescription("");
    setContactId("");
    setContactName("");
    setProjectId("");
    setProjectName("");
    setStartDate("");
    // Reset time to current time
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // Format: HH:MM
    setStartTime(currentTime);
    setEndDate("");
    setEndTime(currentTime);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
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

    try {
      setIsSubmitting(true);
      setError(null);

      // Create start and end datetime strings
      let startedAt, endedAt;

      if (showDateSelectors) {
        startedAt = new Date(`${startDate}T${startTime}`).toISOString();
        endedAt = new Date(`${endDate}T${endTime}`).toISOString();
      } else {
        // Use current date with selected time when date selectors are hidden
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        startedAt = new Date(`${today}T${startTime}`).toISOString();
        endedAt = new Date(`${today}T${endTime}`).toISOString();
      }

      // Create the time entry object
      const newEntry: Omit<TimeEntry, "id"> = {
        description,
        contact: {
          id: contactId,
          name: contactName,
        },
        project: {
          id: projectId,
          name: projectName,
        },
        started_at: startedAt,
        ended_at: endedAt,
        time: "", // This will be calculated by the API
      };

      // Add the time entry
      await addTimeEntry(newEntry);

      // Reset form
      resetForm();
    } catch (err) {
      console.error("Failed to create time entry:", err);
      setError("Failed to create time entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if API is configured
  const isApiConfigured = Boolean(apiToken && administrationId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="What did you work on?"
          disabled={!isApiConfigured || isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactId" className="text-sm font-medium">
            Contact ID
          </Label>
          <input
            id="contactId"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Contact ID"
            disabled={!isApiConfigured || isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName" className="text-sm font-medium">
            Contact Name
          </Label>
          <input
            id="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Contact Name"
            disabled={!isApiConfigured || isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectId" className="text-sm font-medium">
            Project ID
          </Label>
          <input
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Project ID"
            disabled={!isApiConfigured || isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectName" className="text-sm font-medium">
            Project Name
          </Label>
          <input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Project Name"
            disabled={!isApiConfigured || isSubmitting}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showDateSelectors"
          checked={showDateSelectors}
          onChange={(e) => setShowDateSelectors(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          disabled={!isApiConfigured || isSubmitting}
        />
        <Label htmlFor="showDateSelectors" className="text-sm font-medium">
          Show date selectors
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {showDateSelectors && (
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </Label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!isApiConfigured || isSubmitting}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium">
            Start Time
          </Label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!isApiConfigured || isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {showDateSelectors && (
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </Label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!isApiConfigured || isSubmitting}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm font-medium">
            End Time
          </Label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!isApiConfigured || isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={resetForm}
          disabled={!isApiConfigured || isSubmitting}
        >
          Reset
        </Button>
        <Button 
          type="submit"
          disabled={!isApiConfigured || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
