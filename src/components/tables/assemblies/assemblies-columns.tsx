"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { findBy } from "@/lib/resources/assembly";
import { resources } from "@/lib/resources";
import { Assembly } from "@/schemas/assembly";
import { Brother } from "@/schemas/brother";
import { useLangue } from "@/context/langue-context";
import LeaderModal from "@/components/dialog/leader-modal";
import { tr } from "@/translation";

// Table columns definition
export default function Menu({ assembly }: Readonly<{ assembly: Assembly }>) {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<Brother>();
  const { lng } = useLangue();
  const onOpenChange = () => {
    setOpen(!open);
  };

  const learder = async () => {
    findBy(
      resources.heads,
      lng,
      {
        column: "assembly_id",
        value: assembly.id,
      },
      [{ table: "brothers", type: "BelongsTo" }]
    ).then((head) => {
      setUser(head.brother);
    });
  };

  useEffect(() => {
    learder();
    return () => {};
  }, [assembly]);

  return (
    <div>
      {user && (
        <LeaderModal
          user={user}
          cancel={true}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="ghost"
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Detail</span>
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
export const assembliesColumns: ColumnDef<Assembly>[] = [
  {
    accessorKey: "name",
    header: tr("table.name"),
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="whitespace-break-spaces">{name}</span>;
    },
  },
  {
    accessorKey: "address",
    header: tr("table.address"),
    cell: ({ row }) => {
      const address = row.original.address;
      return <span className="whitespace-break-spaces">{address}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assembly = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu assembly={assembly} />
          </DropdownMenuTrigger>
        </DropdownMenu>
      );
    },
  },
];
