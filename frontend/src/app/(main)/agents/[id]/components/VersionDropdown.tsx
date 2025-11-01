"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Check } from "lucide-react";

type Version = {
  id: string;
  label: string;
};

type VersionDropdownProps = {
  versions?: Version[];
  value?: string;
  className?: string;
  onChange?: (versionId: string) => void;
  paramName?: string; // URL query param to sync with (default: "version")
};

export default function VersionDropdown({
  versions = [{ id: "v1.0", label: "v1.0" }],
  value,
  className,
  onChange,
  paramName = "version",
}: VersionDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const current = useMemo(() => {
    const currentId = value || searchParams.get(paramName) || versions[0]?.id;
    return versions.find((v) => v.id === currentId) || versions[0];
  }, [value, searchParams, paramName, versions]);

  const handleSelect = (versionId: string) => {
    if (onChange) onChange(versionId);

    // Default behavior: sync with URL query without full navigation
    const params = new URLSearchParams(searchParams.toString());
    if (versionId) params.set(paramName, versionId);
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="xs" className={cn("bg-primary/10 text-primary hover:bg-primary/20 text-xs px-2 py-0.5 h-auto focus-visible:ring-0 dark:bg-accent-foreground/50 dark:text-white dark:hover:bg-accent-foreground/90", className)}>
          {current?.label}
          <ChevronRight 
            className={cn("scale-90 opacity-60 -mr-1 transition-transform duration-200", open && "rotate-90")} 
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-24 min-w-auto">
        {versions.map((v) => (
          <DropdownMenuItem
            key={v.id}
            onClick={() => handleSelect(v.id)}
            className="relative text-xs py-1 pr-1 overflow-hidden cursor-pointer"
          >
            <span className="truncate">{v.label}</span>
            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
              <Check
                className={cn(
                  "h-4 w-4 text-accent dark:text-accent-foreground",
                  current?.id === v.id ? "opacity-100" : "opacity-0"
                )}
              />
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}