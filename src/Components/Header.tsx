import { Menu, Settings, LogOut, User } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GoogleIcon, GithubIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import logo from "../Assets/header_logo.png";

interface HeaderProps {
  name?: string;
  googleLogin: () => void;
  githubLogin: () => void;
  logout: () => void;
}

export default function Header({
  name,
  googleLogin,
  githubLogin,
  logout,
}: HeaderProps) {
  const isLoggedIn = !!name;

  return (
    <header className="relative flex w-full items-center justify-center py-4">
      {/* Logo centered */}
      <div className="flex flex-col items-center">
        <img src={logo} alt="CipherCollector" />
      </div>

      {/* Menu button anchored top-right */}
      <div className="absolute right-4 top-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-12">
                <Menu className="size-7" />
                <span className="sr-only">Open menu</span>
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-52">
            {isLoggedIn ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="size-4 shrink-0" />
                    <span className="truncate">{name}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuItem>My Collection</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sign in</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={googleLogin}>
                  <HugeiconsIcon
                    icon={GoogleIcon}
                    className="mr-2 size-4"
                    size={16}
                  />
                  Google Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={githubLogin}>
                  <HugeiconsIcon
                    icon={GithubIcon}
                    className="mr-2 size-4"
                    size={16}
                  />
                  GitHub Login
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
