"use client";

import { tr } from "@/translation";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

const PrintButton = ({
  documentTitle,
  elementId,
  style,
  children,
}: {
  documentTitle: string;

  elementId: string;
  style?: string;
  children?: React.ReactNode;
}) => {
  const [isBrowser, setIsBrowser] = useState<boolean>(false);
  const [printJS, setPrintJS] = useState<typeof import("print-js") | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);

      // Dynamically import print-js in the browser
      import("print-js").then((module) => {
        setPrintJS(() => module.default);
      });
    }
  }, []);

const handlePrint = () => {

  const isSafari = /Mac/.test(navigator.platform) && /AppleWebKit/.test(navigator.userAgent);
console.log(isSafari, 'isSafari')
  if (isBrowser && printJS) {
    printJS({ // Make sure you're calling the function with ()
      printable: elementId,
      type: "html",
      style: style,
      ignoreElements: ["esc", "esc1", "esc2"],
      documentTitle: documentTitle,
      onPrintDialogClose: () => {
        // Cleanup if needed
      },
      onError: (error) => {
        console.error("Print error:", error);
      }
    });
  } else {
    console.error("PrintJS not available");
  }
};

  return (
    <div onClick={handlePrint} className="print-button">
      {children || <Button>{tr("button.pdf")}</Button>}
    </div>
  );
};

export default PrintButton;
