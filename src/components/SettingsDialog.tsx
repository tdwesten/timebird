import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsIcon } from "lucide-react";
import { useMoneybirdStore } from "@/stores/moneybird";
import { Combobox } from "@/components/ui/combobox";
import { fetchUsers } from "@/api/moneybird";

export function SettingsDialog() {
  const { apiToken, administrationId, setApiToken, setAdministrationId, initialized, initialize, userId, setUserId } = useMoneybirdStore();
  const [localApiToken, setLocalApiToken] = useState("");
  const [localAdminId, setLocalAdminId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showApiToken, setShowApiToken] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  useEffect(() => {
    if (initialized) {
      setLocalApiToken(apiToken);
      setLocalAdminId(administrationId);
      setLocalUserId(userId);
    }
  }, [apiToken, administrationId, userId, initialized]);

  useEffect(() => {
    if (localApiToken && localAdminId) {
      setLoadingUsers(true);
      fetchUsers(localApiToken, localAdminId)
        .then(setUsers)
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [localApiToken, localAdminId]);

  const handleSave = async () => {
    await setApiToken(localApiToken);
    await setAdministrationId(localAdminId);
    await setUserId(localUserId);
    setIsOpen(false);
  };

  const resetForm = async () => {
    setLocalApiToken("");
    setLocalAdminId("");
    setLocalUserId("");
    setUsers([]);

    await setApiToken("");
    await setAdministrationId("");
    await setUserId("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 rounded-md hover:bg-gray-100">
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className={'border-b pb-4'}>
          <DialogTitle>Moneybird Settings</DialogTitle>
          <p className={'text-sm text-gray-500 text-left'}>
            Configure your Moneybird API settings to enable integration with your Moneybird account.
            Please ensure you have the correct API token, administration ID and select the user you want to associate with you timetracking data.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="adminId">Administration ID</Label>
            <p className={'text-sm text-gray-500'}>You can find your administration ID in the url of your Moneybird administration, e.g. <code>https://moneybird.com/123456789</code>.</p>
            <Input id="adminId" value={localAdminId} onChange={e => setLocalAdminId(e.target.value)} autoComplete="off" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiToken">API Token</Label>
            <p className={'text-sm text-gray-500'}>You can create an API token in your Moneybird account settings under Settings &gt; External applications. Leave all permissions checked except the "Bank" permission.</p>
            <div className="flex gap-2 items-center">
              <Input id="apiToken" type={showApiToken ? "text" : "password"} value={localApiToken} onChange={e => setLocalApiToken(e.target.value)} autoComplete="off" />
              <Button type="button" variant="outline" size="sm" onClick={() => setShowApiToken(v => !v)}>
                {showApiToken ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="userId">User</Label>
            <p className={'text-sm text-gray-500'}>Select the user you want to associate with your timetracking data.</p>
            <Combobox
              options={users.map(u => ({ value: u.id, label: u.name }))}
              value={localUserId}
              onChange={opt => setLocalUserId(opt.value)}
              placeholder={loadingUsers ? "Loading users..." : "Select user"}
              inputId="userId"
              disabled={loadingUsers || !users.length}
            />
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={() => resetForm()}>Reset</Button>
          <Button onClick={handleSave} disabled={!localApiToken || !localAdminId}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}