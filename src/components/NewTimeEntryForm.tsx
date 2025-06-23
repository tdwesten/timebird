import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { PlusIcon } from "lucide-react";
import { useMoneybirdStore } from "@/stores/moneybird";
import { TimeEntry } from "@/api/moneybird";

export function NewTimeEntryForm() {
  const { addTimeEntry, apiToken, administrationId } = useMoneybirdStore();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [contactId, setContactId] = useState("");
  const [contactName, setContactName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setDescription("");
    setContactId("");
    setContactName("");
    setProjectId("");
    setProjectName("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
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
    
    if (!startDate || !startTime || !endDate || !endTime) {
      setError("Start and end times are required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create start and end datetime strings
      const startedAt = new Date(`${startDate}T${startTime}`).toISOString();
      const endedAt = new Date(`${endDate}T${endTime}`).toISOString();
      
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
      
      // Reset form and close dialog
      resetForm();
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2"
          disabled={!isApiConfigured}
          title={!isApiConfigured ? "Configure API settings first" : "Add new time entry"}
        >
          <PlusIcon className="w-4 h-4" />
          New Time Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Time Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
              />
            </div>
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
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
              />
            </div>
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
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}