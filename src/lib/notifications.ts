import { API_URL } from "./env";

//users notifications
export const NOTIFICATIONS = "NOTIFICATIONS";

export type Notification = {
  id: number;
  initial: string;
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
};

const mergeNotifications = (
  localNotifs: Notification[],
  serverNotifs: Notification[]
): Notification[] => {
  const map = new Map<string, Notification>();

  // Commencer par les locales (priorité à l’état local : lu/supprimé)
  localNotifs.forEach((notif) => map.set(notif.id.toString(), notif));

  // Ajouter celles du serveur (sans écraser les locales)
  serverNotifs.forEach((notif) => {
    if (!map.has(notif.id.toString())) {
      map.set(notif.id.toString(), notif);
    }
  });

  // Retourner un tableau trié par date descendante (les plus récentes d’abord)
  return Array.from(map.values()).sort((a, b) => {
    const dateA = a.read_at || a.deleted_at || "";
    const dateB = b.read_at || b.deleted_at || "";
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
  lng: string,
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
      params.append("ids[]", id.toString())
    );

    const url = `${API_URL}/${lng}/notifications?${params.toString()}`;

    // 🔹 4. Appeler l’API pour récupérer les nouvelles notifications
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const serverData: Notification[] = await response.json();

    // 🔹 5. Fusionner les notifications locales et serveur sans doublons
    const allNotifis = mergeNotifications(localNotifs, serverData);

    // 🔹 6. Sauvegarder la liste finale dans le localStorage
    setNotifications(allNotifis);
  } catch (error) {
    console.error("Erreur lors du chargement des notifications :", error);
    setNotifications(mockNotifications)
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



/// donner de mock

// --- Génération automatique des 24 notifications de test ---

const langs = [

  { initial: "fr-fr", web_translation: "fr" },
  { initial: "en-en", web_translation: "en" },
  { initial: "es-es", web_translation: "es" },
  { initial: "pt-pt", web_translation: "pt" },
];

// Helper pour date aléatoire
function randomDate(daysAgo = 30) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d.toISOString();
}

// Helper pour contenu tronqué
function generateContent(lang: string, index: number): string {
  const samples: Record<string, string[]> = {
    en: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, expedita officiis quos, aut et totam nihil maiores excepturi tempore recusandae neque praesentium unde similique itaque alias voluptatibus, molestiae voluptatem harum?",
      "Your session has expired, please log in again.",
      "New update available for your account.",
      "You have a new message from admin.",
      "Security alert detected in your account.",
      "Your subscription has been renewed successfully.",
    ],
    es: [
      "¡Bienvenido a tu panel!",
      "Tu sesión ha expirado, inicia sesión nuevamente.",
      "Nueva actualización disponible para tu cuenta.",
      "Tienes un nuevo mensaje del administrador.",
      "Alerta de seguridad detectada en tu cuenta.",
      "Tu suscripción ha sido renovada con éxito.",
    ],
    pt: [
      "Bem-vindo ao seu painel!",
      "Sua sessão expirou, faça login novamente.",
      "Nova atualização disponível para sua conta.",
      "Você tem uma nova mensagem do administrador.",
      "Alerta de segurança detectado na sua conta.",
      "Sua assinatura foi renovada com sucesso.",
    ],
    fr: [
      "Bienvenue sur votre tableau de bord !",
      "Votre session a expiré, veuillez vous reconnecter.",
      "Nouvelle mise à jour disponible pour votre compte.",
      "Vous avez un nouveau message de l’administrateur.",
      "Alerte de sécurité détectée sur votre compte.",
      "Votre abonnement a été renouvelé avec succès.",
    ],
  };

  const sample = samples[lang][index % samples[lang].length];
  return sample + " ".repeat(index % 3);
}

// Combinaisons possibles d’états :
// 1. non lue, active
// 2. lue, active
// 3. supprimée, non lue
// 4. lue et supprimée

export const mockNotifications: Notification[] = Array.from({ length: 24 }, (_, i) => {
  const lang = langs[i % langs.length];
  const statusType = i % 4;

  const baseDate = randomDate(20);
  const read_at = statusType === 1 || statusType === 3 ? randomDate(10) : undefined;
  const deleted_at = statusType === 2 || statusType === 3 ? randomDate(5) : undefined;

  return {
    id: i + 1,
    initial: lang.initial,
    web_translation: lang.web_translation,
    content: generateContent(lang.web_translation, i),
    url: i % 3 === 0 ? `https://example.com/notification/${i + 1}` : undefined,
    read_at,
    deleted_at,
    created_at: baseDate,
    updated_at: randomDate(3),
  };
});
