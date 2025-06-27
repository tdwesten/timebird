import { useEffect } from "react";
import "./App.css";
import { TimeEntriesTable } from "./components/TimeEntriesTable";
import { NewTimeEntryForm } from "./components/NewTimeEntryForm";
import { useMoneybirdStore } from "./stores/moneybird";
import { SettingsDialog } from "./components/SettingsDialog";
import { InfoDialog } from "./components/InfoDialog";
import { OnboardingDialog } from "./components/OnboardingDialog";

function App() {
  const { initialize, initialized } = useMoneybirdStore();

  // Initialize the store when the app loads
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return (<div className="flex flex-col border-t h-screen w-screen bg-gray-50 overflow-y-scroll">
      <div className={`p-4`}>
        <h2 className="text-lg font-semibold mb-4">New Time Entry</h2>
        <NewTimeEntryForm />
      </div>
    <div className="flex flex-col h-screen w-screen border-t">
      <main className="py-6 px-4 w-screen flex-1 h-screen bg-gray-100 overflow-y-auto">
        {!useMoneybirdStore.getState().apiToken && <OnboardingDialog />}
        <div className={'mb-14'}>
          <TimeEntriesTable />
        </div>
        <div className="fixed bottom-0 right-0 z-50 bg-white border-l border-t p-3 rounded-tl-md">
          <SettingsDialog />
        </div>
        <div className="fixed bottom-0 left-0 z-50 bg-white border-r border-t p-3 rounded-tr-md">
          <InfoDialog />
        </div>
      </main>
    </div>
  </div>
  );
}

export default App;
