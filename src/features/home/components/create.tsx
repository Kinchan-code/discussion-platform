import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProtectedAction } from "@/hooks/use-protected-action";
import { PathName } from "@/enums/path-enums";
import { useHeaderStore } from "@/store/header-store";

/**
 * Create Component
 * @description Create Protocol and Discussion Dropdown Menu
 *
 * components used:
 * - Button
 * - DropdownMenu
 * - DropdownMenuContent
 * - DropdownMenuGroup
 * - DropdownMenuItem
 * - DropdownMenuLabel
 * - DropdownMenuTrigger
 *
 * @param {string} className - The class name for the button.
 * @param {function} onClick - The function to be called when the button is clicked.
 *
 * @returns {JSX.Element} The Create Component.
 *
 * @example
 * <Create />
 *
 */

const menuItems = [
  { id: 1, label: "Create Protocol" },
  { id: 2, label: "Create Discussion" },
];

function Create() {
  const navigate = useNavigate();
  const { executeProtectedAction } = useProtectedAction();
  const { setIsOpen } = useHeaderStore();

  const handleCreateProtocol = () => {
    executeProtectedAction(() => {
      navigate(PathName.CREATE_PROTOCOL);
      setIsOpen(false);
    });
  };

  const handleCreateDiscussion = () => {
    executeProtectedAction(() => {
      navigate(PathName.CREATE_THREAD);
      setIsOpen(false);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="w-5 h-5" />
          Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Contribute</DropdownMenuLabel>
        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={
                item.label === "Create Protocol"
                  ? handleCreateProtocol
                  : handleCreateDiscussion
              }
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { Create };
