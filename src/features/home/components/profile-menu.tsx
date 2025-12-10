import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/api/auth/logout";
import { PathName } from "@/enums/path-enums";

/**
 * Dropdown Menu Component
 * @description Profile Menu
 *
 * components used
 * - DropdownMenu
 * - DropdownMenuTrigger
 * - DropdownMenuContent
 * - DropdownMenuGroup
 * - DropdownMenuItem
 * - DropdownMenuLabel
 * - DropdownMenuShortcut
 *
 * @param {string} className - The class name for the dropdown menu.
 * @param {function} onClick - The function to be called when the dropdown menu is clicked.
 * @param {string} children - The children of the dropdown menu.
 * @param {boolean} isOpen - Whether the dropdown menu is open.
 * @param {function} setIsOpen - Function to set the open state of the dropdown menu.
 *
 * @returns {JSX.Element} The Profile Menu component.
 * @example
 * <ProfileMenu />
 */

interface DropDownMenuType {
  label: string;
  shortcut: string;
  onClick?: () => void;
}

function ProfileMenu() {
  const navigate = useNavigate();
  const { mutateAsync: logout } = useLogout();

  const handleProfileClick = () => {
    // Handle profile click logic here
    navigate(PathName.USER_PROTOCOLS);
  };

  const handleLogout = () => {
    toast.promise(logout(), {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Logout failed. Please try again.",
    });
    // Note: Navigation is handled by the useLogout hook
  };

  const dropDownMenu: DropDownMenuType[] = [
    { label: "Profile", shortcut: "shift + p", onClick: handleProfileClick },
    { label: "Logout", shortcut: "shift + l", onClick: handleLogout },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          {dropDownMenu.map((item) => (
            <DropdownMenuItem key={item.label} onClick={item.onClick}>
              {item.label}
              <DropdownMenuShortcut className="text-xs">
                {item.shortcut}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ProfileMenu };
