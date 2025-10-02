"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectSearch, SelectType } from "@/schemas/city";

type FilterType = { [key: string]: string | number | undefined };

const SelectWithSearch = ({
  title,
  body,
  column,
  type,
  setSelect,
}: {
  title: string;
  body: FilterType[];
  column: string;
  type: SelectType;
  setSelect: (value: SelectSearch) => void;
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredItems, setFilteredItems] =
    React.useState<Array<FilterType>>(body);
  const [isOpen, setIsOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Handle Search Input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter items based on search term
    const filtered = body.filter((item: FilterType) =>
      item[column]?.toString().toLowerCase().includes(value)
    );
    setFilteredItems(filtered);
  };

  // Handle Value Change
  const handleValueChange = (value: string) => {
    if (setSelect) {
      setSelect({ id: parseInt(value), type: type });
    }
    setSearchTerm(""); // Réinitialiser la recherche après sélection
    setFilteredItems(body);
  };

  // Focus automatique sur l'input quand le select s'ouvre
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else if (!isOpen) {
      // Réinitialiser la recherche quand le select se ferme
      setSearchTerm("");
      setFilteredItems(body);
    }
  }, [isOpen, body]);

  // Mettre à jour les items filtrés quand le body change
  React.useEffect(() => {
    setFilteredItems(body);
  }, [body]);

  return (
    <div className="mx-2 border-2 border-pkp-ocean dark:border-white rounded-lg">
      <Select
        onValueChange={handleValueChange}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-[280px] cursor-pointer">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent
          className="bg-muted/100 border-2 border-pkp-ocean dark:border-white"
          onPointerDownOutside={(e) => {
            // Empêcher la fermeture si on clique dans l'input de recherche
            if (searchInputRef.current?.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
        >
          <div className="p-2">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={title}
              className="w-full px-2 py-1 dark:text-black border border-pkp-ocean rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                // Empêcher la propagation des touches pour éviter les conflits
                e.stopPropagation();
                // Empêcher la fermeture du select avec Escape
                if (e.key === "Escape") {
                  e.preventDefault();
                  setIsOpen(false);
                }
              }}
              onMouseDown={(e) => {
                // Empêcher la perte de focus lors du clic
                e.stopPropagation();
              }}
            />
          </div>
          <SelectGroup>
            <SelectLabel>{title}</SelectLabel>
            {/* Render Filtered Items */}
            {filteredItems.length > 0 ? (
              filteredItems.map((item: any) => (
                <SelectItem
                  className="cursor-pointer"
                  key={item.id}
                  value={item.id.toString()}
                >
                  {item[column]}
                </SelectItem>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">
                No results found
              </p>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithSearch;
