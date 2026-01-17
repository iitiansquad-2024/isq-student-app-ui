"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bell, EllipsisVertical, Menu, X, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
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
  const router = useRouter();
  const { user, loading, logout: authLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const examOptions = [
    { id: "jee", name: "JEE Main & Advanced" },
    { id: "neet", name: "NEET" },
    { id: "gate", name: "GATE" },
    { id: "upsc", name: "UPSC" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authLogout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="flex w-full items-center justify-between gap-4  px-4 py-2 backdrop-blur-sm ring-0 border-b border-b-stone-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onOpenChange(!open)}
            className="cursor-pointer hover:bg-gray-100 rounded-md p-1 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar 
                    src={user.image_url || ""} 
                    name={user.name} 
                    size={36} 
                    className="cursor-pointer hover:ring-2 hover:ring-yellow-400 transition-all"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar 
                    src={""} 
                    name={"Guest"} 
                    size={36} 
                    className="cursor-pointer hover:ring-2 hover:ring-yellow-400 transition-all"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/signup')} className="cursor-pointer">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
