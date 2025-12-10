import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import EditButton from "@/components/edit-button";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormTextArea } from "@/components/ui/form-textarea";
import { StarRating } from "@/components/ui/star-rating";
import { useEditReview } from "@/api/reviews/edit-review";
import {
  createReviewSchema,
  type CreateReviewSchemaType,
} from "@/features/protocols/pages/one-protocol/schema/create-review-schema";
import { useReviewStore } from "@/store/review-store";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditReviewProps {
  setOpen: () => void;
}

/**
 * EditReview component allows users to edit an existing review for a protocol.
 *
 * @description It displays a dialog with a form to update the rating and feedback.
 *
 * components used:
 * - EditButton: Button to open the edit dialog.
 * - Dialog: Modal dialog component.
 * - DialogContent: Content area of the dialog.
 * - DialogHeader: Header section of the dialog.
 * - DialogTitle: Title of the dialog.
 * - DialogDescription: Description text in the dialog.
 * - Form: Form component for handling form state and validation.
 * - FormTextArea: Text area for entering feedback.
 * - StarRating: Component for selecting a rating.
 * - useEditReview: Custom hook for editing a review.
 * - useReviewStore: Store for managing review state.
 *
 * @param {EditReviewProps} props - The props for the EditReview component.
 * @param {() => void} props.setOpen - Function to open the edit dialog.
 *
 * @returns {JSX.Element} The EditReview component.
 * @example
 * <EditReview setOpen={handleOpenEdit} />
 */

function EditReview({ setOpen }: EditReviewProps) {
  const { isOpenEdit, setOpenEdit, selectedReview } = useReviewStore();
  const [selectedRating, setSelectedRating] = useState(
    selectedReview?.rating ?? 0
  );

  const { mutateAsync, isPending } = useEditReview(
    selectedReview?.id?.toString() ?? "",
    () => {
      setSelectedRating(0);
      form.reset();
    }
  );

  const form = useForm<CreateReviewSchemaType>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: selectedReview?.rating ?? 0,
      feedback: selectedReview?.feedback ?? "",
    },
  });

  // Update form values when selectedReview changes
  useEffect(() => {
    if (selectedReview) {
      form.setValue("rating", selectedReview.rating);
      form.setValue("feedback", selectedReview.feedback ?? "");
      setSelectedRating(selectedReview.rating);
    }
  }, [selectedReview, form]);

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
    form.trigger("rating"); // Trigger validation for the rating field
  };

  const handleSubmit = async (values: CreateReviewSchemaType) => {
    try {
      await toast.promise(mutateAsync({ body: values }), {
        success: "Review edited successfully!",
        loading: "Editing review...",
        error: "Failed to edit review.",
      });
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  const handleCancel = () => {
    setOpenEdit(false); // Close the review modal
    form.reset(); // Reset the form
  };

  return (
    <Dialog open={isOpenEdit} onOpenChange={setOpenEdit}>
      <EditButton onClick={setOpen} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Edit your thoughts about this protocol.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <section className="flex flex-col gap-2 items-center">
              <StarRating
                value={selectedRating}
                onChange={handleRatingChange}
                size="md"
                showLabel={true}
              />
              {form.formState.errors.rating && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.rating.message}
                </p>
              )}
            </section>
            <FormTextArea
              placeholder="Write your feedback here..."
              {...form.register("feedback")}
            />

            <section className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="text-xs md:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs md:text-sm"
                disabled={isPending} // Disable button while review is being created
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin size-3 md:size-4" />
                    Editing...
                  </div>
                ) : (
                  "Edit Review"
                )}
              </Button>
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditReview;
