import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsIcon } from "lucide-react";
import { useMoneybirdStore } from "@/stores/moneybird";
import { Combobox } from "@/components/ui/combobox";
import { fetchUsers } from "@/api/moneybird";
import { useTranslation } from "react-i18next";

export function SettingsDialog() {
  const { apiToken, administrationId, setApiToken, setAdministrationId, initialized, initialize, userId, setUserId } = useMoneybirdStore();
  const { t, i18n } = useTranslation();
  const [localApiToken, setLocalApiToken] = useState("");
  const [localAdminId, setLocalAdminId] = useState("");
  const [localUserId, setLocalUserId] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showApiToken, setShowApiToken] = useState(false);
  const [localLanguage, setLocalLanguage] = useState(i18n.resolvedLanguage || 'nl');

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  useEffect(() => {
    if (initialized) {
      setLocalApiToken(apiToken);
      setLocalAdminId(administrationId);
      setLocalUserId(userId);
    }
  }, [apiToken, administrationId, userId, initialized]);

  useEffect(() => {
    if (localApiToken && localAdminId) {
      setLoadingUsers(true);
      fetchUsers(localApiToken, localAdminId)
        .then(setUsers)
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [localApiToken, localAdminId]);

  const handleSave = async () => {
    await setApiToken(localApiToken);
    await setAdministrationId(localAdminId);
    await setUserId(localUserId);
    setIsOpen(false);
  };

  const resetForm = async () => {
    setLocalApiToken("");
    setLocalAdminId("");
    setLocalUserId("");
    setUsers([]);

    await setApiToken("");
    await setAdministrationId("");
    await setUserId("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 rounded-md hover:bg-gray-100">
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className={'border-b pb-4'}>
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <p className={'text-sm text-gray-500 text-left'}>{t('settings.intro1')}</p>
          <p className={'text-sm text-gray-500 text-left'}>{t('settings.intro2')}</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="adminId">{t('settings.adminId')}</Label>
            <p className={'text-sm text-gray-500'}>{t('settings.adminIdHelp')}</p>
            <Input id="adminId" value={localAdminId} onChange={e => setLocalAdminId(e.target.value)} autoComplete="off" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiToken">{t('settings.apiToken')}</Label>
            <p className={'text-sm text-gray-500'}>{t('settings.apiTokenHelp')}</p>
            <div className="flex gap-2 items-center">
              <Input id="apiToken" type={showApiToken ? "text" : "password"} value={localApiToken} onChange={e => setLocalApiToken(e.target.value)} autoComplete="off" />
              <Button type="button" variant="outline" size="sm" onClick={() => setShowApiToken(v => !v)}>
                {showApiToken ? t('common.hide') : t('common.show')}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="userId">{t('settings.user')}</Label>
            <p className={'text-sm text-gray-500'}>{t('settings.userHelp')}</p>
            <Combobox
              options={users.map(u => ({ value: u.id, label: u.name }))}
              value={localUserId}
              onChange={opt => setLocalUserId(opt.value)}
              placeholder={loadingUsers ? t('settings.loadingUsers') : t('settings.selectUser')}
              inputId="userId"
              disabled={loadingUsers || !users.length}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language">{t('settings.language')}</Label>
            <Combobox
              options={[
                { value: 'nl', label: t('settings.language_nl') },
                { value: 'en', label: t('settings.language_en') }
              ]}
              value={localLanguage}
              onChange={(opt) => { setLocalLanguage(opt.value); i18n.changeLanguage(opt.value); }}
              inputId="language"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={() => resetForm()}>{t('common.reset')}</Button>
          <Button onClick={handleSave} disabled={!localApiToken || !localAdminId}>
            {t('common.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}