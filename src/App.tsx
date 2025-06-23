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
    console.log("App initialized");
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <main className="container mx-auto py-6 px-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <NewTimeEntryForm />
        </div>
        <TimeEntriesTable />
      </main>
    </div>
  );
}

export default App;
