import { Sermon } from "@/schemas/sermon";
import { Input } from "../ui/input";
import { tr } from "@/translation";
import { ChangeEvent } from "react";

const SermonHeader = ({
  sermon,
  handleLocalSearch,
  search,
}: {
  sermon: Sermon;
  search: string;
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
          djdjd
          {/* <SongPlayerManualButton
                        setFinishedDownload={setFinishedDownload}
                        type="Sermon"
                        data={sermon}
                        fileIsDownload={fileIsDownload}
                      /> */}
          {/* <PrintButton
                        elementId="invoice"
                        style={`
                  .invoice {line-height: 25px; text-align: justify;}
                   .print-number {font-size: 2em;} #invoice {margin-left: 100px; font-size: 30px;}
                   `}
                        documentTitle={sermon.title}
                      >
                        <Printer className="cursor-pointer mx-2 text-primary dark:text-white"></Printer>
                      </PrintButton> */}
        </div>
        <Input
          type="text"
          placeholder={tr("button.search")}
          defaultValue={search}
          onChange={handleLocalSearch}
          className="border-primary dark:border-white dark:border-2 w-full outline-none"
        />
      </div>
    </>
  );
};

export default SermonHeader;
