import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Bell, Eye, Trash, MailOpen } from "lucide-react";
import { useDebounce } from "use-debounce";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";
import { tr } from "@/translation";
import {
  getNotifications,
  markNotificationAsDeleted,
  markNotificationAsRead,
  markNotificationsAsDeleted,
  markNotificationsAsRead,
} from "@/lib/notifications";
import { useLangue } from "@/context/langue-context";

import type { Notification } from "@/lib/notifications";
import truncate from "html-truncate";

const NotificationDropdown = () => {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 300);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { webTranslation } = useLangue();

  // Charger les notifications
  const loadNotifications = useCallback(() => {
    const all = getNotifications({ web_translation: webTranslation });
    setLocalNotifications(all);
  }, [webTranslation]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Filtrer les notifications avec memoization
  const filteredNotifications = useMemo(() => {
    return localNotifications.filter((n) => {
      const searchMatch = n.content
        ?.toLowerCase()
        .includes(searchDebounce.toLowerCase());

      switch (activeTab) {
        case "unread":
          return !n.read_at && !n.deleted_at && searchMatch;
        case "deleted":
          return !!n.deleted_at && searchMatch;
        default:
          return !n.deleted_at && searchMatch;
      }
    });
  }, [localNotifications, activeTab, searchDebounce]);

  // Compter les notifications non lues
  const unreadCount = useMemo(() => {
    return localNotifications.filter((n) => !n.read_at && !n.deleted_at).length;
  }, [localNotifications]);

  // Compter les notifications non supprimées
  const undeleteCount = useMemo(() => {
    return localNotifications.filter((n) => !n.deleted_at).length;
  }, [localNotifications]);

  // Actions globales avec gestion d'erreur
  const handleReadAll = useCallback(() => {
    setIsOpen(false);
    handleConfirmAlert(tr("button.confirm_action"), false, async () => {
      try {
        setIsLoading(true);
        markNotificationsAsRead();
        loadNotifications();
      } catch (error) {
        console.error("Erreur lors du marquage des notifications:", error);
      } finally {
        setIsLoading(false);
        setIsOpen(false);
      }
    });
  }, [loadNotifications]);

  const handleClearAll = useCallback(() => {
    setIsOpen(false);
    handleConfirmAlert(tr("button.confirm_action"), false, async () => {
      try {
        setIsLoading(true);
        markNotificationsAsDeleted();
        loadNotifications();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      } finally {
        setIsLoading(false);
        setIsOpen(false);
      }
    });
  }, [loadNotifications]);

  // Actions unitaires
  const handleMarkAsRead = useCallback(
    (id: number) => {
      setIsOpen(false);
      handleConfirmAlert(tr("button.confirm_action"), false, () => {
        markNotificationAsRead(id);
        loadNotifications();
      });
    },
    [loadNotifications]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setIsOpen(false);
      handleConfirmAlert(tr("button.confirm_action"), false, () => {
        markNotificationAsDeleted(id);
        loadNotifications();
      });
    },
    [loadNotifications]
  );

  const handleViewNotification = useCallback(
    (notif: Notification) => {
      setIsOpen(false);
      markNotificationAsRead(notif.id);
      loadNotifications();
      handleConfirmAlert(notif.content, !notif.url, () => {
        console.log(notif.url);
      });
    },
    [handleMarkAsRead]
  );

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const toggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
    },
    []
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400"
          aria-label={`${tr("notification.notifications")} (${unreadCount} ${tr(
            "notification.unread"
          )})`}
        >
          <Bell className="object-cover p-0.5 cursor-pointer text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-8 w-8 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white" />
          {unreadCount > 0 && (
            <span className="-ml-4 -mt-6 h-5 w-5 text-white bg-red-500 rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-full min-w-sm mb-4 rounded-2xl border border-gray-200 p-3 shadow-lg dark:border-gray-800 bg-pkp-sand dark:bg-gray-800"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex justify-around mb-3">
            <TabsTrigger value="all">
              <span className=" capitalize">{tr("notification.all")}</span>
            </TabsTrigger>
            <TabsTrigger value="unread">
              <span className="capitalize">{tr("notification.unread")}</span>
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="deleted">
              <span className="capitalize">{tr("notification.deleted")}</span>
            </TabsTrigger>
          </TabsList>

          <Input
            placeholder={tr("button.search")}
            onChange={handleSearch}
            value={search}
            className="mb-3 border-pkp-ocean"
            disabled={isLoading}
          />

          <TabsContent value={activeTab}>
            <ul className="max-h-[400px] overflow-auto flex flex-col gap-2">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notif={notif}
                    onView={handleViewNotification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                  />
                ))
              ) : (
                <li className="text-center text-gray-500 text-sm py-4 capitalize">
                  {tr("notification.no_notification")}
                </li>
              )}
            </ul>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4 border-t pt-3 border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReadAll}
            disabled={isLoading || unreadCount === 0}
            className="cursor-pointer ext-blue-500 dark:text-blue-300 text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <span className="capitalize">{tr("notification.read_all")}</span>
          </button>
          <button
            onClick={handleClearAll}
            disabled={isLoading || undeleteCount === 0}
            className="cursor-pointer text-red-500 dark:text-red-300 text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <span className="capitalize">{tr("notification.delete_all")}</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Composant extrait pour chaque notification
interface NotificationItemProps {
  notif: Notification;
  onView: (notif: Notification) => void;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const NotificationItem = React.memo(
  ({
    notif,
    onView,
    onMarkAsRead,
    onDelete,
    isLoading,
  }: NotificationItemProps) => {
    const isUnread = !notif.read_at && !notif.deleted_at;
    const isDeleted = !!notif.deleted_at;
    const truncatedHTML = truncate(notif.content, 50, { ellipsis: "..." });
    return (
      <li className="flex justify-between items-start gap-3 border-b pb-2 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors">
        <div className="flex flex-col flex-1 min-w-0">
          <span
            onClick={() => onView(notif)}
            className={`text-sm font-medium truncate ${
              isUnread
                ? "text-gray-900 dark:text-gray-100 font-semibold"
                : "text-gray-700 dark:text-gray-400"
            }`}
            title={notif.content}
            dangerouslySetInnerHTML={{
              __html: truncatedHTML,
            }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(notif.updated_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onView(notif)}
                disabled={isLoading}
                className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
                title={tr("notification.see")}
              >
                <Eye className="w-3 h-3" />
              </button>
              {isUnread && (
                <button
                  onClick={() => onMarkAsRead(notif.id)}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700 text-xs flex items-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
                  title={tr("notification.make_as_read")}
                >
                  <MailOpen className="w-3 h-3" />
                </button>
              )}
              {!isDeleted && (
                <button
                  onClick={() => onDelete(notif.id)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
                  title={tr("notification.deleted")}
                >
                  <Trash className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

export default NotificationDropdown;
