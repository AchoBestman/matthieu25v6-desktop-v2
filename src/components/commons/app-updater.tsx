import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";
import { tr } from "@/translation";
import { useUpdater } from "@/hooks/use-updater";

const AppUpdaterDropdown = () => {
  const { update, progress, status, error, checkForUpdate, installUpdate } =
    useUpdater();

  useEffect(() => {
    // Automatically check on startup ddd
    checkForUpdate();
    console.log(status);
  }, [checkForUpdate]);

  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    checkForUpdate();
    setIsOpen((prev) => !prev);
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="outline-none">
        {update?.version && (
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 dark:text-gray-400"
          >
            <span className="h-8 w-8 ml-1.5 cursor-pointer">
              <RefreshCw className="object-cover p-0.5 cursor-pointer text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-8 w-8 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white" />
            </span>
            {update && (
              <span className="-ml-4 -mt-6 h-5 w-5 text-white bg-red-500 rounded-full">
                {1}
              </span>
            )}
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-sm min-w-sm mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className="max-h-[500px] overflow-auto border-t pt-4 pb-8 border-gray-200 dark:border-gray-800 flex flex-col gap-1">
          {update?.version && (
            <li>
              <DropdownMenuItem className="flex-col -mt-1 items-center justify-between font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                <div className="flex items-center mb-2">
                  <div className="flex items-center justify-between">
                    <span className="mr-2 text-3xl">
                      Prophet Kacou v{update.version}
                    </span>
                    {status === "downloading" && (
                      <progress
                        style={{ borderRadius: "6px" }}
                        value={progress + 20}
                        max={100}
                      />
                    )}
                  </div>
                  <button
                    className="flex cursor-pointer ml-4"
                    onClick={async (e) => {
                      handleConfirmAlert(
                        tr("button.confirm_action"),
                        false,
                        () => installUpdate()
                      );
                      toggleDropdown(e);
                    }}
                  >
                    {status === "idle" && update && (
                      <RefreshCw className="w-7 text-red-500"></RefreshCw>
                    )}
                  </button>
                </div>
                {error && <p className="text-red-500">⚠️ ss{error}</p>}
              </DropdownMenuItem>
            </li>
          )}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppUpdaterDropdown;
