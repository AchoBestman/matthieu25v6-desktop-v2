//database last update key
export const DB_LAST_UPDATE_KEY = "languesLastUpdates";

//database available update key
export const DB_AVAILABLE_UPDATE_KEY = "languesAvailableUpdates";

//total database available update key
export const TOTAL_DB_AVAILABLE_UPDATE_KEY = "totalLanguesToUpdate";

export type AppDataUpdate = {
  id: number;
  langue: string;
  created_at: string;
  updated_at: string;
};

//function to not be exported
const setTotalAppDataUpdatesAvailable = (data: string[]): void => {
  localStorage.setItem(TOTAL_DB_AVAILABLE_UPDATE_KEY, JSON.stringify(data));
};

const getAppDataUpdatesAvailable = (): AppDataUpdate[] => {
  const response = localStorage.getItem(DB_AVAILABLE_UPDATE_KEY);
  if (!response) return [];

  return JSON.parse(response) as AppDataUpdate[];
};

const getLastAppDataUpdates = (): AppDataUpdate[] => {
  const response = localStorage.getItem(DB_LAST_UPDATE_KEY);
  if (!response) return [];

  return JSON.parse(response) as AppDataUpdate[];
};

const getAppDataUpdateAvailable = (lang: string): AppDataUpdate | undefined => {
  const response = getAppDataUpdatesAvailable().find(
    (item: AppDataUpdate) => item.langue === lang
  );
  if (!response) return undefined;

  return response as AppDataUpdate;
};

const getLastAppDataUpdate = (lang: string): AppDataUpdate | undefined => {
  const response = getLastAppDataUpdates().find(
    (item: AppDataUpdate) => item.langue === lang
  );
  if (!response) return undefined;

  return response as AppDataUpdate;
};

//function to be exported

export const getTotalAppDataUpdatesAvailable = (): string[] => {
  const response = localStorage.getItem(TOTAL_DB_AVAILABLE_UPDATE_KEY);
  if (!response) return [];

  return JSON.parse(response) as string[];
};

export const setAppDataUpdatesAvailable = (data: AppDataUpdate[]): void => {
  localStorage.setItem(DB_AVAILABLE_UPDATE_KEY, JSON.stringify(data));
};

export const setLastAppDataUpdates = (data: AppDataUpdate[]): void => {
  if (getLastAppDataUpdates().length === 0) {
    localStorage.setItem(DB_LAST_UPDATE_KEY, JSON.stringify(data));
  }
};

export const dbHasNewUpdate = (lang: string): AppDataUpdate | undefined => {
  const totalAvailable: string[] = getTotalAppDataUpdatesAvailable();
  const lastUpdatedAt = getLastAppDataUpdate(lang);
  const currentUpdate = getAppDataUpdateAvailable(lang);

  if (!currentUpdate) return undefined;
  

  const lastTime = lastUpdatedAt ? new Date(lastUpdatedAt.updated_at).getTime() : 0;
  const currentTime = new Date(currentUpdate.updated_at).getTime();

  const hasUpdate = currentTime > lastTime;


  if (hasUpdate && !totalAvailable.includes(lang)) {
    totalAvailable.push(lang);
    setTotalAppDataUpdatesAvailable(totalAvailable);
  }

  return hasUpdate ? currentUpdate : undefined;
};

export const updateLangueLastUpdate = async (data: AppDataUpdate) => {
  const updates = getLastAppDataUpdates();
  const exists = updates.some((item) => item.langue === data.langue);

  const response = exists
    ? updates.map((item) => (item.langue === data.langue ? data : item))
    : [...updates, data];

  localStorage.setItem(DB_LAST_UPDATE_KEY, JSON.stringify(response));

  const totalAvailable: string[] = getTotalAppDataUpdatesAvailable();
  const newTotal: string[] = totalAvailable.filter(
    (item) => item !== data.langue
  );
  setTotalAppDataUpdatesAvailable(newTotal);
};
