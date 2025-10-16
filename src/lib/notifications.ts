import { API_URL } from "./env";

//users notifications
export const NOTIFICATIONS = "NOTIFICATIONS";

export type Notification = {
  id: number;
  langue_initial: string;
  web_translation: string;
  content: string;
  url?: string;
  read_at?: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
};

export type SearchNotificationFilter = {
  web_translation: string;
  content?: string;
  read_at?: boolean;
  deleted_at?: boolean;
  type?: "client" | "server";
};

const mergeNotifications = (
  localNotifs: Notification[],
  serverNotifs: Notification[]
): Notification[] => {
  const map = new Map<string, Notification>();

  // Commencer par les locales
  localNotifs.forEach((notif) => map.set(notif.id.toString(), notif));

  // Ajouter celles du serveur (en écrasant les locales si même id)
  serverNotifs.forEach((notif) => {
    map.set(notif.id.toString(), notif);
  });

  // Retourner un tableau trié par date descendante (les plus récentes d’abord)
  return Array.from(map.values()).sort((a, b) => {
    const dateA = a.read_at || a.deleted_at || a.updated_at || "";
    const dateB = b.read_at || b.deleted_at || b.updated_at || "";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};

const setNotifications = (data: Notification[]): void => {
  localStorage.setItem(NOTIFICATIONS, JSON.stringify(data));
};

const getLocalNotifications = (): Notification[] => {
  const raw = localStorage.getItem(NOTIFICATIONS);
  return raw ? (JSON.parse(raw) as Notification[]) : [];
};

export const getNotifications = (
  search: SearchNotificationFilter
): Notification[] => {
  const notifications = getLocalNotifications();

  return notifications.filter((notif) => {
    // web_translation est obligatoire → on vérifie une correspondance partielle
    const webMatch = notif.web_translation
      .toLowerCase()
      .includes(search.web_translation.toLowerCase());
    if (!webMatch) return false;

    // si un filtre de contenu est précisé → recherche partielle
    if (search.content) {
      const contentMatch = notif.content
        ?.toLowerCase()
        .includes(search.content.toLowerCase());
      if (!contentMatch) return false;
    }

    // Si on filtre par "read_at"
    if (typeof search.read_at === "boolean") {
      const isRead = !!(notif.read_at && !isNaN(Date.parse(notif.read_at)));
      if (isRead !== search.read_at) return false;
    }

    // Si on filtre par "deleted_at"
    if (typeof search.deleted_at === "boolean") {
      const isDeleted = !!(
        notif.deleted_at && !isNaN(Date.parse(notif.deleted_at))
      );
      if (isDeleted !== search.deleted_at) return false;
    }

    return true;
  });
};

export const availableServerNotifications = async (
  langs: string[]
): Promise<void> => {
  try {
    // 🔹 1. Récupérer les notifications locales existantes
    const localNotifsRaw = localStorage.getItem(NOTIFICATIONS);
    const localNotifs: Notification[] = localNotifsRaw
      ? JSON.parse(localNotifsRaw)
      : [];

    // 🔹 2. Identifier les notifications déjà lues ou supprimées localement
    const readAndDeleteNotifsIds = localNotifs
      .filter(
        (notif) =>
          (notif.read_at && !isNaN(Date.parse(notif.read_at))) ||
          (notif.deleted_at && !isNaN(Date.parse(notif.deleted_at)))
      )
      .map((notif) => notif.id);

    // 🔹 3. Construire l’URL avec les IDs de notifications à ignorer côté serveur
    const params = new URLSearchParams();

    [...langs, "common"].forEach((lang) => params.append("langs[]", lang));
    readAndDeleteNotifsIds.forEach((id) =>
      params.append("ids_not_in[]", id.toString())
    );

    params.append("type", "server");
    params.append("is_active", "true");
    params.append("per_page", "1000");

    const url = `${API_URL}/auth/messages?${params.toString()}`;

    // 🔹 4. Appeler l’API pour récupérer les nouvelles notifications
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const serverData: { data: Notification[] } = await response.json();

    // 🔹 5. Fusionner les notifications locales et serveur sans doublons
    const allNotifis = mergeNotifications(localNotifs, serverData.data);

    // 🔹 6. Sauvegarder la liste finale dans le localStorage
    setNotifications(allNotifis);
  } catch (error) {
    console.error("Erreur lors du chargement des notifications :", error);
  }
};

// --- Marquer une notification comme lue
export const markNotificationAsRead = (id: number): void => {
  const notifications = getLocalNotifications();

  const updated = notifications.map((notif) => {
    if (notif.id === id && !notif.read_at) {
      return { ...notif, read_at: new Date().toISOString() };
    }
    return notif;
  });

  setNotifications(updated);
};

// --- Marquer toutes les notifications comme lue
export const markNotificationsAsRead = (): void => {
  const notifications = getLocalNotifications();

  const updated = notifications.map((n) =>
    !n.read_at && !n.deleted_at
      ? { ...n, read_at: new Date().toISOString() }
      : n
  );

  setNotifications(updated);
};

// --- Supprimer (logiquement) une notification
export const markNotificationAsDeleted = (id: number): void => {
  const notifications = getLocalNotifications();

  const updated = notifications.map((notif) => {
    if (notif.id === id && !notif.deleted_at) {
      return { ...notif, deleted_at: new Date().toISOString() };
    }
    return notif;
  });

  setNotifications(updated);
};

// --- Supprimer (logiquement) toutes les notifications
export const markNotificationsAsDeleted = (): void => {
  const notifications = getLocalNotifications();

  const updated = notifications.map((n) =>
    !n.deleted_at ? { ...n, deleted_at: new Date().toISOString() } : n
  );

  setNotifications(updated);
};
