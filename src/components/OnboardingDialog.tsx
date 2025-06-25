import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { useMoneybirdStore } from "@/stores/moneybird";
import { fetchUsers } from "@/api/moneybird";

const steps = ["welcome", "admin", "token", "user", "finished"] as const;
type Step = typeof steps[number];

export function OnboardingDialog() {
  const { apiToken, setApiToken, setAdministrationId, setUserId, initialized, initialize, fetchTimeEntries } = useMoneybirdStore();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [localAdminId, setLocalAdminId] = useState("");
  const [localApiToken, setLocalApiToken] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!initialized) initialize();
  }, [initialized, initialize]);

  useEffect(() => {
    if (!apiToken) setOpen(true);
  }, [apiToken]);

  useEffect(() => {
    if (step === "user" && localApiToken && localAdminId) {
      setLoadingUsers(true);
      fetchUsers(localApiToken, localAdminId)
        .then(setUsers)
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [step, localApiToken, localAdminId]);

  const next = () => setStep(steps[steps.indexOf(step) + 1]);
  const prev = () => setStep(steps[steps.indexOf(step) - 1]);

  const handleFinish = async () => {
    await setApiToken(localApiToken);
    await setAdministrationId(localAdminId);
    await setUserId(localUserId);
    setStep("finished");
    fetchTimeEntries()
    setTimeout(() => setOpen(false), 1200);


  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        {step === "welcome" && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Welcome to Timebird</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">Timebird is a Moneybird time tracking app for macOS, built by Thomas van der Westen (Fullstack developer at Codesmiths). <a href="https://github.com/thomasvanderwesten" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">GitHub</a></p>
            <Button onClick={next} className="w-full">Get started</Button>
          </div>
        )}
        {step === "admin" && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Enter Administration ID</DialogTitle>
            </DialogHeader>
            <Label htmlFor="adminId">Administration ID</Label>
            <p className={'text-sm text-gray-500'}>You can find your administration ID in the url of your Moneybird administration, e.g. <code>https://moneybird.com/123456789</code>.</p>
            <Input id="adminId" value={localAdminId} onChange={e => setLocalAdminId(e.target.value)} autoFocus />
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={prev}>Back</Button>
              <Button onClick={next} disabled={!localAdminId}>Next</Button>
            </div>
          </div>
        )}
        {step === "token" && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Enter API Token</DialogTitle>
            </DialogHeader>
            <p className={'text-sm text-gray-500'}>You can create an API token in your Moneybird account settings under Settings &gt; External applications.</p>

            <Label htmlFor="apiToken">API Token</Label>
            <Input id="apiToken" value={localApiToken} onChange={e => setLocalApiToken(e.target.value)} autoFocus />
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={prev}>Back</Button>
              <Button onClick={next} disabled={!localApiToken}>Next</Button>
            </div>
          </div>
        )}
        {step === "user" && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Select User</DialogTitle>
            </DialogHeader>
            <p className={'text-sm text-gray-500'}>Select the user you want to associate with your timetracking data.</p>

            <Label htmlFor="userId">User</Label>
            <Combobox
              options={users.map(u => ({ value: u.id, label: u.name }))}
              value={localUserId}
              onChange={opt => setLocalUserId(opt.value)}
              placeholder={loadingUsers ? "Loading users..." : "Select user"}
              inputId="userId"
              disabled={loadingUsers || !users.length}
              className={`w-full`}
            />
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={prev}>Back</Button>
              <Button onClick={handleFinish} disabled={!localUserId}>Finish</Button>
            </div>
          </div>
        )}
        {step === "finished" && (
          <div className="space-y-4 text-center">
            <DialogHeader>
              <DialogTitle>All set!</DialogTitle>
            </DialogHeader>
            <p className="text-green-600">You're ready to use Timebird 🎉</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
