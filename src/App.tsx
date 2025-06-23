import { useEffect } from "react";
import "./App.css";
import { TimeEntriesTable } from "./components/TimeEntriesTable";
import { NewTimeEntryForm } from "./components/NewTimeEntryForm";
import { useMoneybirdStore } from "./stores/moneybird";
import { SettingsDialog } from "./components/SettingsDialog";

function App() {
  const { initialize, initialized } = useMoneybirdStore();

  // Initialize the store when the app loads
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return (
    <div className="flex flex-col h-screen w-screen">
      <main className="py-6 px-4 w-screen flex-1 h-screen bg-white border overflow-y-auto">
        <div className="rounded-md border p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Time Entry</h2>
          <NewTimeEntryForm />
        </div>
        <TimeEntriesTable />
        <SettingsDialog />
      </main>
    </div>
  );
}

export default App;
