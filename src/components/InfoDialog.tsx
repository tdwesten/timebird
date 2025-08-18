import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function InfoDialog() {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('info.aria')}>
          <InfoIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>{t('info.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y prose">
          <div className="flex flex-col items-center">
            <img
              src="https://avatars.githubusercontent.com/u/224501?s=400&u=1b201171d615b60bfd505fa958eba6457060afc9&v=4"
              alt={t('info.makerName')}
              className="rounded-full w-16 h-16 mb-2"
            />
            <span className="font-semibold">{t('info.makerName')}</span>
            <div className="mt-1 text-sm text-gray-600 text-center">
              {t('info.roleAt', { company: '' })}
              <a className={'text-blue-900 font-bold'} href={"https://codesmiths.nl"}>Codesmiths</a>
              <br />
              <a
                href="https://github.com/tdwesten"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 break-all"
              >
                {t('info.viewGithub')}
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-600">
              {t('info.contributions', { issues: 'Github Issues', email: 'thomas@codesmiths.nl' })}
              {" "}
              (<a href={"https://github.com/tdwesten/timebird/issues"} className="text-blue-600 underline">Github Issues</a>, <a href={`mailto:thomas@codesmiths.nl`} className="text-blue-600 underline">thomas@codesmiths.nl</a>).
            </div>
            <div className="mt-6 text-sm text-gray-600">
              {t('info.oss', { repo: 'https://github.com/tdwesten/timebird' })}
              <a href={"https://github.com/tdwesten/timebird"} className="text-blue-600 underline">Github</a>.
              <br />
            </div>

            <div className="mt-6 text-sm text-gray-600">
              {t('info.disclaimer')}
            </div>
          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
}

