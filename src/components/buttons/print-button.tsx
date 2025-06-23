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
    if (isBrowser && printJS) {
      printJS({
        printable: elementId,
        type: "html",
        style: style,
        ignoreElements: ["esc", "esc1", "esc2"],
        documentTitle: documentTitle,
      });
    }
  };

  return (
    <div onClick={handlePrint} className="print-button">
      {children || <Button>{tr("button.pdf")}</Button>}
    </div>
  );
};

export default PrintButton;
