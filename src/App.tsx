import "./App.css";
import { TimeEntriesTable } from "./components/TimeEntriesTable";
import { Topbar } from "./components/Topbar";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <main className="container mx-auto py-6 px-4 flex-1">
        <h1 className="text-2xl font-bold mb-6">Moneybird Time Entries</h1>
        <TimeEntriesTable />
      </main>
    </div>
  );
}

export default App;
