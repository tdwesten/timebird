import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { TimeEntriesTable } from "./components/TimeEntriesTable";

function App() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Moneybird Time Entries</h1>
      <TimeEntriesTable />
    </main>
  );
}

export default App;
