import { Loader } from "lucide-react";
import { useEffect } from "react";
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
import { FormInput } from "@/components/ui/form-input";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEditProfile } from "../../../api/profile/edit-profile";
import {
  editProfileSchema,
  type EditProfileSchemaType,
} from "@/features//profile/schema/edit-profile-schema";

/**
 * Edit Profile Component
 * @description Component for editing a user's profile information
 *
 * components used:
 * - Dialog
 * - DialogContent
 * - DialogHeader
 * - DialogTitle
 * - Form
 * - FormInput
 * - Button
 *
 * @param {boolean} isOpen - Controls the open state of the dialog.
 * @param {function} setOpen - Function to set the open state of the dialog.
 *
 * @returns {JSX.Element} The EditProfile component.
 * @example
 * <EditProfile />
 */

function EditProfile() {
  const { isOpen, setOpen } = useProfileStore();
  const { user } = useAuthStore();

  const { mutateAsync, isPending } = useEditProfile(() => {
    setOpen(false);
    form.reset();
  });

  const form = useForm<EditProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      current_password: "",
      new_password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: EditProfileSchemaType) => {
    try {
      await toast.promise(mutateAsync(values), {
        success: "Profile updated successfully!",
        loading: "Updating profile...",
        error: "Failed to update profile.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEdit = () => {
    setOpen(true); // Open the profile edit modal
  };

  const handleCancel = () => {
    setOpen(false); // Close the profile edit modal
    form.reset(); // Reset the form
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <EditButton onClick={handleEdit} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              label="Name"
              placeholder="Enter your name"
              {...form.register("name")}
            />
            <FormInput
              label="Email"
              placeholder="Enter your email"
              {...form.register("email")}
            />
            <FormInput
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              {...form.register("current_password")}
            />
            <FormInput
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              {...form.register("new_password")}
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
                    Updating...
                  </div>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;
