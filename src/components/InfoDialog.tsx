import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

export function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Info">
          <InfoIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>About the Maker</DialogTitle>
        </DialogHeader>
        <div className="space-y prose">
          <div className="flex flex-col items-center">
            <img
              src="https://avatars.githubusercontent.com/u/224501?s=400&u=1b201171d615b60bfd505fa958eba6457060afc9&v=4"
              alt="Thomas van der Westen"
              className="rounded-full w-16 h-16 mb-2"
            />
            <span className="font-semibold">Thomas van der Westen</span>
            <div className="mt-1 text-sm text-gray-600 text-center">
              Fullstack developer @ <a className={'text-blue-900 font-bold'} href={"https://codesmiths.nl"}>Codesmiths</a>
              <br />
              <a
                href="https://github.com/tdwesten"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 break-all"
              >
                View my GitHub profile
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-600">
              I welcome contributions and feedback from the community via the <a href={"https://github.com/tdwesten/timebird/issues"} className="text-blue-600 underline">Github Issues</a> section or via <a href={`mailto:thomas@codesmiths.nl`} className="text-blue-600 underline">thomas@codesmiths.nl</a> .
            </div>
            <div className="mt-6 text-sm text-gray-600">
              This app is <b>Open Source</b> and available on GitHub. You can find the source code at: <a href={"https://github.com/tdwesten/timebird"} className="text-blue-600 underline">Github</a>. <br />
            </div>

            <div className="mt-6 text-sm text-gray-600">
              This app has no affiliation with <b>Moneybird</b>. It is a personal project created to help users manage their time entries more effectively.
            </div>
          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
}

