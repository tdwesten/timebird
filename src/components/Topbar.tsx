import { Logo } from "./Logo";
import { SettingsDialog } from "./SettingsDialog";

export function Topbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
      <Logo />
      <h1 className="text-xl font-semibold">TimeBird</h1>
      <SettingsDialog />
    </div>
  );
}
