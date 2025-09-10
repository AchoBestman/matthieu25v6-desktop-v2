import { Sermon } from "@/schemas/sermon";
import { Input } from "../ui/input";
import { tr } from "@/translation";
import { ChangeEvent } from "react";
import SongPlayerManualButton from "../buttons/manual-player";
import PrintButton from "../buttons/print-button";
import { Printer } from "lucide-react";

const printStyle = `
  /* Style du header de l’invoice */
  #invoice > .print-title {
    display: block !important;
    text-align: center !important;
    font-size: 30px !important;
    font-weight: bold !important;
  }

  /* Style du numéro de verset */
  #invoice span.font-bold {
    font-weight: bold !important;
  }

  #invoice div, #invoice span {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1.5 !important; /* ou 1.1 pour plus serré */
  }

  #invoice .print-concordance{
   color: blue !important;
  }

  .print-hidden{
    display: none !important;
  }

  /* Optionnel : ajuster images */
  #invoice img {
    max-width: 100% !important;
    height: auto !important;
    float: left;
    margin-right: 1rem;
    margin-top: 0.5rem;
  }
`;

const SermonHeader = ({
  sermon,
  handleLocalSearch,
  search,
  fileIsDownload,
  setFinishedDownload,
}: {
  sermon: Sermon;
  search: string;
  fileIsDownload: boolean;
  setFinishedDownload: (fileIsDownload: boolean) => void;
  handleLocalSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <>
      <div className="text-amber-800 dark:text-white text-xl pb-2 italic bold">
        <div className="whitespace-nowrap">
          {`${sermon?.chapter} : ${sermon.title}`}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex justify-start items-center mr-4">
          {sermon.audio && (
            <SongPlayerManualButton
              setFinishedDownload={setFinishedDownload}
              type="Sermons"
              data={sermon}
              fileIsDownload={fileIsDownload}
            />
          )}
          <PrintButton
            elementId="invoice"
            style={printStyle}
            documentTitle={sermon.title}
          >
            <Printer className="cursor-pointer mx-2 text-amber-800 dark:text-white"></Printer>
          </PrintButton>
        </div>
        <Input
          type="text"
          placeholder={tr("button.search")}
          defaultValue={search}
          onChange={handleLocalSearch}
          className="border-amber-800 dark:border-white border-2 w-full outline-none"
        />
      </div>
    </>
  );
};

export default SermonHeader;
