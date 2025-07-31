import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button/button';
import { Loader, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

/**
 * DeleteButton Component
 *
 * @description A button that opens a confirmation dialog before performing a delete action.
 * It can be used to delete items with a confirmation step to prevent accidental deletions.
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
 * @param {function} onDelete - Callback function to handle the delete action.
 * @param {string} description - Optional description for the confirmation dialog.
 * @param {boolean} loading - Optional loading state to indicate processing.
 * @param {boolean} button - Optional prop to control button visibility.
 *
 * @returns A button that triggers a delete confirmation dialog.
 */

interface DeleteButtonProps {
  onDelete?: (e: React.MouseEvent) => void;
  description?: string;
  loading?: boolean;
  button?: boolean;
}

function DeleteButton({
  onDelete,
  description = 'This action cannot be undone. This will permanently remove your data from our servers.',
  loading = false,
  button = false,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        {button ? (
          <Button
            variant='ghost'
            size='icon'
            className='text-xs md:text-sm'
            onClick={handleOpen}
          >
            Delete
          </Button>
        ) : (
          <Button
            variant='outline'
            size='icon'
            className='text-red-500 hover:bg-red-50 hover:text-red-600 text-xs md:text-sm'
            onClick={handleOpen}
          >
            <Trash2Icon className='size-3 md:size-4' />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-sm md:text-base'>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-xs md:text-sm'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className='text-xs md:text-sm'
            onClick={handleClose}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={loading}
            className='text-xs md:text-sm bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
          >
            {loading ? (
              <div>
                <Loader className='size-3 md:size-4 animate-spin text-muted-foreground' />
                <span className='text-xs md:text-sm text-muted-foreground'>
                  Deleting...
                </span>
              </div>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteButton;
