import { Logo } from "./Logo";
import { SettingsDialog } from "./SettingsDialog";

export function Topbar() {
  return (
    <div className="flex justify-between items-center p-2 border-b sticky top-0 bg-white z-40 select-none rounded-t-xl" >
      <Logo />
      <h1 className="text-xl font-semibold">TimeBird</h1>
      <div>
        <SettingsDialog />
      </div>
    </div>
  );
}
