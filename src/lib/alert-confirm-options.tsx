import { ScrollArea } from "@/components/ui/scroll-area";
import { tr } from "@/translation";
import { confirmAlert } from "react-confirm-alert";

/**
 * Converts plain text to HTML with basic formatting
 * @param text - Plain text to convert
 * @returns HTML formatted string
 */
export const textToHtml = (text: string): string => {
  return (
    text
      // Remplace les doubles sauts de ligne par des paragraphes
      .split("\n\n")
      .map((paragraph) => {
        // Traite chaque paragraphe
        let formattedParagraph = paragraph
          // Remplace les simples sauts de ligne par des <br>
          .replace(/\n/g, "<br>")
          // Détecte et formate les titres (lignes seules en majuscules ou commençant par #)
          .replace(/^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]+)$/gm, "<strong>$1</strong>")
          // Formate les emails
          .replace(/(📧\s*)([^\s<]+@[^\s<]+)/g, '$1<a href="mailto:$2">$2</a>')
          // Formate les URLs (http, https)
          .replace(
            /(https?:\/\/[^\s<]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
          );

        return `<p>${formattedParagraph}</p>`;
      })
      .join("")
  );
};

export const alertConfirmOptions = (
  isAlert: boolean,
  message: string,
  handleConfirm?: () => void,
  title?: string,
  isPlainText: boolean = false
) => {
  const formattedMessage = isPlainText ? textToHtml(message) : message;

  return {
    title: title ?? "",
    message: "",
    customUI: ({ onClose }: { onClose: () => void }) => (
      <div className="react-confirm-alert-body">
        {title && <h1 className="text-xl font-semibold">{title}</h1>}

        <ScrollArea className="p-3">
          <div
            className="text-lg whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: formattedMessage }}
          />
        </ScrollArea>

        <div className="react-confirm-alert-button-group flex justify-end gap-3">
          {isAlert ? (
            <button onClick={onClose} className="btn-primary">
              {tr("button.close")}
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  handleConfirm?.();
                  onClose();
                }}
                className="btn-primary"
              >
                {tr("button.confirm")}
              </button>
              <button onClick={onClose} className="btn-secondary">
                {tr("button.cancel")}
              </button>
            </>
          )}
        </div>
      </div>
    ),
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };
};

/**
 * Opens a confirmation or alert dialog with a custom title and formatted message.
 *
 * @function handleConfirmAlert
 * @param {string} message - Message displayed in the dialog. Can be plain text or HTML.
 * @param {boolean} [isAlert=true] - If true, shows a simple alert with one button;
 *                                    if false, shows a confirmation dialog with confirm and cancel buttons.
 * @param {() => void} [handleConfirm] - Optional callback function executed when the user confirms the action.
 *                                       Only used if isAlert is false.
 * @param {string} [title] - Optional title of the dialog.
 * @param {boolean} [isPlainText=false] - If true, converts plain text to HTML with automatic formatting.
 *                                        If false, treats message as raw HTML.
 *
 * @example
 * // Alert with plain text (auto-formatted)
 * handleConfirmAlert(
 *   `Guide d'utilisation
 *
 * Cher utilisateur,
 *
 * Ceci est un message avec des liens : https://example.com
 * Et un email : contact@example.com`,
 *   true,
 *   undefined,
 *   "Notification",
 *   true // Active le formatage automatique
 * );
 *
 * @example
 * // Confirmation with raw HTML
 * handleConfirmAlert(
 *   "Voulez-vous supprimer <strong>cet élément</strong> ?",
 *   false,
 *   () => console.log("Confirmed"),
 *   "Confirmation",
 *   false // Traite comme du HTML brut
 * );
 *
 * @returns {void}
 */
export const handleConfirmAlert = (
  message: string,
  isAlert: boolean = true,
  handleConfirm?: () => void,
  title?: string,
  isPlainText: boolean = false
) => {
  confirmAlert(
    alertConfirmOptions(isAlert, message, handleConfirm, title, isPlainText)
  );
};
