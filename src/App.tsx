import { useEffect } from "react";
import "./App.css";
import { TimeEntriesTable } from "./components/TimeEntriesTable";
import { Topbar } from "./components/Topbar";
import { NewTimeEntryForm } from "./components/NewTimeEntryForm";
import { useMoneybirdStore } from "./stores/moneybird";

function App() {
  const { initialize, initialized } = useMoneybirdStore();

  // Initialize the store when the app loads
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <main className="container mx-auto py-6 px-4 flex-1 overflow-y-scroll h-screen">
        <div className="rounded-md border p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Time Entry</h2>
          <NewTimeEntryForm />
        </div>
        <TimeEntriesTable />
      </main>
    </div>
  );
}

export default App;
