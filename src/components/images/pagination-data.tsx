import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PhotoSearchParams } from "@/schemas/photo";
import { LinksType, MetaType } from "@/schemas/sermon";
import { tr } from "@/translation";

const PaginationData = ({
  pagination,
  setSearchParams,
}: {
  setSearchParams: (search: PhotoSearchParams) => void;
  pagination: {
    links?: LinksType;
    meta?: MetaType;
  };
}) => {
  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{tr("table.line_per_page")}</p>
          <Select
            value={`${pagination.meta?.perPage}`}
            onValueChange={(value) => {
              setSearchParams({ per_page: Number(value) });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.meta?.total} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100, 150, 200, 500, 1000, 2000, 5000].map(
                (pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {tr("table.page")} {pagination.meta?.currentPage} /{" "}
          {pagination.meta?.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              setSearchParams({ page: pagination.links?.first ?? 1 })
            }
            disabled={!pagination.links?.first}
          >
            <span className="sr-only">1ère page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setSearchParams({ page: pagination.links?.prev ?? 1 })
            }
            disabled={!pagination.links?.prev}
          >
            <span className="sr-only">{tr("table.previous")}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setSearchParams({
                page: pagination.links?.next ?? 1,
              })
            }
            disabled={!pagination.links?.next}
          >
            <span className="sr-only">{tr("table.next")}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              setSearchParams({
                page: pagination.links?.last ?? 1,
              })
            }
            disabled={!pagination.links?.last}
          >
            <span className="sr-only">Dernière page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationData;
