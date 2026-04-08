import * as React from "react";
import { Menu, Globe, GitBranch, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProfileMenu(props) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="size-12" />}
          >
            <Menu className="size-7" />
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Account settings</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="justify-center font-medium">
          {props.name ?? "Guest"}
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-center">
          My Collection
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => props.googleLogin()}>
          <Globe className="mr-2 size-4" />
          Google Login
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => props.githubLogin()}>
          <GitBranch className="mr-2 size-4" />
          GitHub Login
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => props.logout()}>
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
