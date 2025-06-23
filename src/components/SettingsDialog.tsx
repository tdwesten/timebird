import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { SettingsIcon } from "lucide-react";
import { useMoneybirdStore } from "@/stores/moneybird";

export function SettingsDialog() {
  const { apiToken, administrationId, setApiToken, setAdministrationId, initialized, initialize } = useMoneybirdStore();
  const [localApiToken, setLocalApiToken] = useState("");
  const [localAdminId, setLocalAdminId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Initialize the store when the component mounts
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // Update local state when store values change
  useEffect(() => {
    if (initialized) {
      setLocalApiToken(apiToken);
      setLocalAdminId(administrationId);
    }
  }, [apiToken, administrationId, initialized]);

  const handleSave = async () => {
    await setApiToken(localApiToken);
    await setAdministrationId(localAdminId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 rounded-md hover:bg-gray-100">
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Moneybird Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiToken" className="text-right">
              API Token
            </Label>
            <input
              id="apiToken"
              type="password"
              value={localApiToken}
              onChange={(e) => setLocalApiToken(e.target.value)}
              className="col-span-3 p-2 border rounded"
              placeholder="Enter your Moneybird API token"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminId" className="text-right">
              Administration ID
            </Label>
            <input
              id="adminId"
              value={localAdminId}
              onChange={(e) => setLocalAdminId(e.target.value)}
              className="col-span-3 p-2 border rounded"
              placeholder="Enter your Moneybird administration ID"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}