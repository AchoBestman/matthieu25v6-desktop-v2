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
  body: FilterType[]; // Array of objects with dynamic keys
  column: string;
  type: SelectType;
  setSelect: (value: SelectSearch) => void;
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredItems, setFilteredItems] =
    React.useState<Array<FilterType>>(body);

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
      setSelect({ id: parseInt(value), type: type }); // Trigger the onSelect callback if provided
    }
  };

  return (
    <div className=" mx-2 border-2 border-amber-800 dark:border-white rounded-lg">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent className="bg-muted/100 border-2 border-amber-800 dark:border-white">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={title}
              className="w-full px-2 py-1 dark:text-black border border-amber-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <SelectGroup>
            <SelectLabel>{title}</SelectLabel>
            {/* Render Filtered Items */}
            {filteredItems.length > 0 ? (
              filteredItems.map((item: any) => (
                <SelectItem
                  className=" cursor-pointer"
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
