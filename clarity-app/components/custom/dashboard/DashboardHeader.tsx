"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BellIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
const dropdownElements = ["one", "two", "three"];

const notifications = ["hello", "how are you", "great bro"];

export default function DashboardHeader({
  name,
  last_name,
}: {
  name: string;
  last_name: string;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notificationCount = notifications.length;
  return (
    <header className="sticky bg-header backdrop-blur-xs top-0 border-b w-full m-auto h-20 flex max-sm:px-3 gap-4 justify-between pl-3 pr-20 py-2 z-10">
      <div className="flex items-center gap-4 flex-2">
        <Image
          className=""
          src="/app logos/full logo light.png"
          alt="Clarity Logo"
          width={140}
          height={40}
        />
        <div className="max-md:hidden"></div>
      </div>
      <div className="flex items-center gap-2 max-sm:gap-2 flex-1 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex flex-row-reverse justify-around">
              {notificationCount > 0 && (
                <div
                  className={`bg-destructive flex justify-center items-center ${
                    notificationCount > 5
                      ? "w-5 text-xs h-5"
                      : "w-[18px] text-[12px] h-[18px]"
                  } -ml-3 rounded-full text-primary-foreground font-bold`}
                >
                  {notificationCount > 5 ? "5+" : notificationCount}
                </div>
              )}
              <BellIcon className="mt-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {notifications.map((noti, i) => {
              return (
                <DropdownMenuItem
                  className="hover:bg-transparent focus:bg-transparent"
                  key={i}
                >
                  {noti}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent">
              <Button variant="outline">View all notifications</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar>
          <AvatarImage src="/auth/example profile avatar.png" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name[0].toUpperCase() + last_name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <DropdownMenu
          onOpenChange={() => {
            setDropdownOpen((prev) => !prev);
          }}
        >
          <DropdownMenuTrigger
            className={`focus:outline-none ${dropdownOpen ? "rotate-180" : ""}`}
          >
            <button className="w-fit h-fit flex items-center">
              <ChevronDown />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            {dropdownElements.map((dropdownEl, i) => {
              return <DropdownMenuItem key={i}>{dropdownEl}</DropdownMenuItem>;
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
