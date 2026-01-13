"use client";

import { cn } from "@/lib/utils";
import { Bell, EllipsisVertical, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { Badge } from "./badge";
import Avatar from "./avatar";

type TopNavProps = {
  showSecondRow?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TopNav({
  showSecondRow = false,
  open,
  onOpenChange,
}: TopNavProps) {
  const examOptions = [
    { id: "jee", name: "JEE Main & Advanced" },
    { id: "neet", name: "NEET" },
    { id: "gate", name: "GATE" },
    { id: "upsc", name: "UPSC" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="flex w-full items-center justify-between gap-4  px-4 py-2 backdrop-blur-sm ring-0 border-b border-b-stone-200">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5" />
          <img src="/isq-logo-white.svg" alt="Logo" className="w-32 h-auto" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer transition-colors duration-100"
          >
            <Bell className="h-5 w-5" />
            <Badge
              className="absolute top-0 right-0 h-2 w-2 p-0"
              variant="destructive"
            />
          </Button>
          {/* <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-brand text-gray-900">
              {getInitials("Guest")}
            </AvatarFallback>
          </Avatar> */}
        </div>
      </div>

      <div className="w-full border-b px-4 py-2 text-sm flex justify-between">
        <Select defaultValue="jee">
          <SelectTrigger className="text-xs h-fit cursor-pointer transition-colors duration-100 hover:bg-stone-50">
            <SelectValue placeholder="Select exam" className="text-xs" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            {examOptions.map((exam) => (
              <SelectItem
                key={exam.id}
                value={exam.id}
                className="text-xs hover:bg-stone-50 transition-colors duration-100 cursor-pointer"
              >
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden bg-stone-100 hover:bg-stone-200"
        >
          <EllipsisVertical className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

export default TopNav;
