import {Settings, SettingsIcon} from "lucide-react";
import { Logo } from "./Logo";
import {Button} from "@/components/ui/button.tsx";

export function Topbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
      <Logo />
      <h1 className="text-xl font-semibold">TimeBird</h1>
      <Button variant={"ghost"} className="p-2 rounded-md hover:bg-gray-100">

        <SettingsIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}