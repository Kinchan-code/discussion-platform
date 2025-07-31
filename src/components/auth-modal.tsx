import { useAuthModalStore } from '@/store/auth-modal-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PathName } from '@/models/path-enums';
import { useNavigate } from 'react-router-dom';

/**
 * AuthModal Component
 *
 * @description Modal that prompts user to login when an action requires authentication.
 *
 * components used:
 * - AlertDialog
 * - AlertDialogContent
 * - AlertDialogHeader
 * - AlertDialogTitle
 * - AlertDialogDescription
 * - AlertDialogFooter
 * - AlertDialogCancel
 * - AlertDialogAction
 *
 * @param {boolean} isOpen - Controls the open state of the modal.
 * @param {function} setOpen - Function to set the open state of the modal.
 *
 * @returns {JSX.Element} The AuthModal component.
 * @example
 * <AuthModal />
 */

function AuthModal() {
  const { isOpen, setOpen } = useAuthModalStore();
  const navigate = useNavigate();

  const cancel = () => setOpen(false);
  const confirm = () => {
    setOpen(false);
    navigate(PathName.LOGIN);
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={setOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Authentication Required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to login to perform this action. Would you like to go to
            the login page?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>Go to Login</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { AuthModal };
