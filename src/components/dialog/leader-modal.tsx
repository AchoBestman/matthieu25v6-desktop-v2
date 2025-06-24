import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Brother } from "@/schemas/brother";
import { tr } from "@/translation";

const LeaderModal = ({
  open,
  onOpenChange,
  user,
  cancel,
}: {
  open: boolean;
  user: Brother;
  onOpenChange: (value: boolean) => void;
  cancel?: boolean;
}) => {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="border-2 border-amber-800 dark:border-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{tr("table.username_info")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tr("table.name")}: {user.full_name}
            </AlertDialogDescription>
            <AlertDialogDescription>
              {tr("table.phone")}: {user.phone}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {cancel && (
              <AlertDialogCancel className="border-amber-800 dark:border-white border-2">
                {tr("button.close")}
              </AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaderModal;
