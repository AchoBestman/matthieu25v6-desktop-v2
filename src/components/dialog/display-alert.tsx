import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { tr } from "@/translation";

const DisplayAlert = ({
  open,
  onOpenChange,
  title,
  message,
  cancel,
  next,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  message: string;
  next?: boolean;
  cancel?: boolean;
}) => {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="border-primary dark:border-white border-2">
          <AlertDialogHeader>
            <AlertDialogTitle className="italic">{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {cancel && (
              <AlertDialogCancel className="border-primary dark:border-white border-2 italic">
                {tr("button.close")}
              </AlertDialogCancel>
            )}
            {next && (
              <AlertDialogAction className="border-primary dark:border-white border-2">
                Continue
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DisplayAlert;
