import { tr } from "@/translation";
import { confirmAlert } from "react-confirm-alert";

export const alertConfirmOptions = (
  isAlert: boolean,
  message: string,
  handleConfirm?: () => void,
  title?: string
) => ({
  title: title ?? "",
  message: message,
  buttons: isAlert
    ? [
        {
          label: tr("button.close"), // bouton unique pour alert
          onClick: () => console.log("close"),
        },
      ]
    : [
        {
          label: tr("button.confirm"),
          onClick: () => handleConfirm && handleConfirm(), // confirm si fourni
        },
        {
          label: tr("button.cancel"),
          onClick: () => console.log("cancel"),
        },
      ],
  closeOnEscape: true,
  closeOnClickOutside: true,
  keyCodeForClose: [8, 32],
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypress: () => {},
  onKeypressEscape: () => {},
  overlayClassName: "overlay-custom-class-name",
});


/**
 * Opens a confirmation or alert dialog with a custom title and message.
 *
 * @function handleConfirmAlert
 * @param {boolean} [isAlert=true] - If true, shows a simple alert with one button; 
 *                                    if false, shows a confirmation dialog with confirm and cancel buttons.
 * @param {string} message - Message displayed in the dialog.
 * @param {() => void} [handleConfirm] - Optional callback function executed when the user confirms the action. 
 *                                       Only used if isAlert is false.
 * @param {string} [title] - Optional title of the dialog.
 *
 * @example
 * // Confirmation dialog
 * handleConfirmAlert(
 *   false,
 *   "Are you sure you want to delete this user?",
 *   () => deleteUser(42),
 *   "Confirmation"
 * );
 *
 * @example
 * // Simple alert
 * handleConfirmAlert(
 *   true,
 *   "This is an alert message!",
 *   undefined,
 *   "Alert"
 * );
 *
 * @returns {void} - Returns nothing. Simply triggers the confirmation or alert dialog.
 */
export const handleConfirmAlert = (
  message: string,
  isAlert: boolean = true,
  handleConfirm?: () => void,
  title?: string
) => {
  confirmAlert(alertConfirmOptions(isAlert, message, handleConfirm, title));
};

