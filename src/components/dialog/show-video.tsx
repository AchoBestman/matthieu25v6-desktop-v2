import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { tr } from "@/translation";

type ModalType = {
  title: string;
  url: string;
  open: boolean;
  onOpenChange: () => void;
};
export function ShowVideoModal({
  title,
  open,
  onOpenChange,
}: Readonly<ModalType>) {
  return (
    <div>
      <AlertDialog onOpenChange={onOpenChange} open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="capitalize bg-red-600  text-white hover:text-red-600 hover:bg-white hover:border-red-600">
              {tr("button.close")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
