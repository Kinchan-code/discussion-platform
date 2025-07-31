import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormTextArea } from '@/components/ui/form-textarea';
import { StarRating } from '@/components/ui/star-rating';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { useReviewStore } from '@/store/review-store';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateReview } from '../api/create-review';
import {
  createReviewSchema,
  type CreateReviewSchemaType,
} from '@/features/protocols/pages/one-protocol/schema/create-review-schema';

/**
 * CreateReview Component
 * @description Component for creating a review for a protocol
 *
 * components used:
 * - Dialog
 * - DialogContent
 * - DialogHeader
 * - DialogTitle
 * - Form
 * - FormTextArea
 * - StarRating
 *
 * @param {boolean} isOpen - Controls the open state of the dialog.
 * @param {function} setOpen - Function to set the open state of the dialog.
 *
 * @returns {JSX.Element} The CreateReview component.
 * @example
 * <CreateReview />
 */

function CreateReview() {
  const { protocolId } = useParams();
  const { isOpen, setOpen } = useReviewStore();
  const { executeProtectedAction } = useProtectedAction();
  const [selectedRating, setSelectedRating] = useState(0);

  const { mutateAsync, isPending } = useCreateReview(protocolId ?? '', () => {
    setOpen(false);
    setSelectedRating(0);
    form.reset();
  });

  const form = useForm<CreateReviewSchemaType>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 0,
      feedback: '',
    },
  });

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    form.setValue('rating', rating);
    form.trigger('rating'); // Trigger validation for the rating field
  };

  const handleSubmit = async (values: CreateReviewSchemaType) => {
    try {
      await toast.promise(mutateAsync({ body: values }), {
        success: 'Review created successfully!',
        loading: 'Creating review...',
        error: 'Failed to create review.',
      });
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const handleWriteReview = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Logic to handle writing a review, e.g., opening a modal or navigating to a review form
    executeProtectedAction(
      () => {
        setOpen(true); // Open the review modal
        e.stopPropagation(); // Prevent event bubbling if needed
        e.preventDefault(); // Prevent default action if needed
      } // This function will only run if the user is authenticated
    );
  };

  const handleCancel = () => {
    setOpen(false); // Close the review modal
    setSelectedRating(0); // Reset the rating
    form.reset(); // Reset the form
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setOpen}
    >
      <Button
        className='w-full text-xs md:text-sm'
        onClick={handleWriteReview}
      >
        Write a Review
      </Button>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about this protocol.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-col gap-4'
          >
            <section className='flex flex-col gap-2 items-center'>
              <StarRating
                value={selectedRating}
                onChange={handleRatingChange}
                size='md'
                showLabel={true}
              />
              {form.formState.errors.rating && (
                <p className='text-red-500 text-xs'>
                  {form.formState.errors.rating.message}
                </p>
              )}
            </section>
            <FormTextArea
              placeholder='Write your feedback here...'
              {...form.register('feedback')}
            />

            <section className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                className='text-xs md:text-sm'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='text-xs md:text-sm'
                disabled={isPending} // Disable button while review is being created
              >
                {isPending ? (
                  <div className='flex items-center gap-2'>
                    <Loader className='animate-spin size-3 md:size-4' />
                    Creating...
                  </div>
                ) : (
                  'Create Review'
                )}
              </Button>
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateReview;
