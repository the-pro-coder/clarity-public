import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
const dropdownElements = ["oneancbaibcaobb", "two", "three"];

export default function DashboardHeader({
  name,
  last_name,
}: {
  name: string;
  last_name: string;
}) {
  return (
    <header className="sticky bg-header backdrop-blur-xs top-0 border-b w-full m-auto h-20 flex max-sm:px-3 gap-4 justify-between pl-3 pr-20 py-2">
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
        <Avatar>
          <AvatarImage src="/auth/example profile avatar.png" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name[0].toUpperCase() + last_name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger>
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
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
