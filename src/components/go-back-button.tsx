import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { useNavigate } from 'react-router-dom';

/**
 * GoBackButton Component
 *
 * @description A button that navigates the user back to the previous page.
 * It can be used in various contexts where a "back" navigation is needed.
 *
 * components used:
 * - Button: The main button component.
 * - ArrowLeftIcon: Icon indicating backward navigation.
 *
 * @param {function} handleGoBack - Function to handle the back navigation.
 *
 * @returns A button that triggers navigation to the previous page.
 * @example
 * <GoBackButton />
 */

function GoBackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant='ghost'
      className='text-xs md:text-sm font-semibold'
      onClick={handleGoBack}
    >
      <ArrowLeftIcon className='size-3 md:size-4' />
      Back
    </Button>
  );
}

export default GoBackButton;
