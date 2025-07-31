import { Button } from '@/components/ui/button/button';
import { SquarePenIcon } from 'lucide-react';

/**
 * EditButton Component
 *
 * @description A button that triggers an edit action.
 * It can be used to initiate editing of items like posts, comments, etc.
 *
 * components used:
 * - Button: The main button component.
 *
 * @param {function} onClick - Callback function to handle the edit action.
 *
 * @returns A button that triggers an edit action.
 * @example
 * <EditButton onClick={handleEdit} />
 */

interface EditButtonProps {
  onClick?: () => void;
}

function EditButton({ onClick }: EditButtonProps) {
  return (
    <Button
      variant='outline'
      size='icon'
      className='text-xs md:text-sm'
      onClick={onClick}
    >
      <SquarePenIcon className='size-3 md:size-4' />
    </Button>
  );
}

export default EditButton;
