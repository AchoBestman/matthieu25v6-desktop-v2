import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { X, Search, ShieldClose } from "lucide-react";
import { tr } from "@/translation";
import { useQuery } from "@tanstack/react-query";
import { findAllVerses } from "@/lib/resources/sermon";
import { resources } from "@/lib/resources";
import { useDebounce } from "use-debounce";
import { useLangue } from "@/context/langue-context";
import { useSermon } from "@/context/sermon-context";

export function SearchDrawer({
  open,
  onClose,
}: Readonly<{
  open: boolean;
  onClose: () => void;
}>) {
  const [query, setQuery] = React.useState("");

  const handleClear = () => setQuery("");
  const [searchParamsDebouce] = useDebounce(query, 300);
  const { lng } = useLangue();
  const { fontSize, setVerseNumber, setNumber } = useSermon();
  const navigate = useNavigate();

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["verses", searchParamsDebouce, lng],
    queryFn: () =>
      findAllVerses(
        resources.verses,
        lng,
        { search: searchParamsDebouce },
        {
          column: "id",
          direction: "DESC",
        }
      ),
  });

  const stripHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const highlightText = (text: string, keyword: string) => {
    const cleanText = stripHtml(text);
    if (!keyword) return cleanText;

    const regex = new RegExp(`(${keyword})`, "gi");
    return cleanText.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-blue-600 dark:bg-yellow-300 text-white dark:text-black p-1"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50">
      <div className="mt-20 ml-85 w-full max-w-4xl rounded-l-2xl shadow-lg bg-pkp-sand dark:bg-gray-800 p-4">
        {/* Header */}
        <div className="flex items-center border-b pb-2">
          <Search className="mr-2 h-5 w-5 text-gray-400 border-pkp-ocean" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr("button.search")}
            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100"
          />
          {query && (
            <button
              onClick={handleClear}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <ShieldClose className="h-5 w-5 text-red-700 cursor-pointer" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-3 max-h-140 overflow-y-auto">
          {results && results.length > 0 ? (
            <ul className="space-y-3">
              {results.map((item) => (
                <li key={item.id} style={{ fontSize }}>
                  <button
                    className="block cursor-pointer text-left rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setNumber(item.sermon_number.toString());
                      setVerseNumber(item.number.toString());
                      onClose();
                      navigate({ to: "/sermons" });
                    }}
                  >
                    <span className="bg-blue-600 dark:bg-yellow-300 text-white dark:text-black p-1">
                      [k{item.sermon_number}.v{item.number}]
                    </span>{" "}
                    {highlightText(item.content, query)}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            query &&
            !isError &&
            !isLoading && (
              <p className="text-sm text-gray-400">
                {tr("table.no_result")}...
              </p>
            )
          )}
          {isError && <span>{tr("home.search_not_found_title")}</span>}
          {isLoading && <span>{tr("home.waiting")}</span>}
        </div>
      </div>
    </div>
  );
}
