import { ArrowLeft, FileText, Info, Loader, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormTextArea } from "@/components/ui/form-textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createProtocolSchema,
  type CreateProtocolSchemaType,
} from "@/features/protocols/pages/create-protocol/schema/create-protocol-schema";
import { useEditProtocol } from "@/api/protocols/edit-protocol";
import { useGetOneProtocol } from "@/api/protocols/one-protocol";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Tags } from "@/types/tags";

/**
 * EditProtocolForm Component
 * @description Form for editing a protocol
 *
 * components used:
 * - Form
 * - FormInput
 * - FormTextArea
 * - Card
 * - CardHeader
 * - CardContent
 * - Button
 * - Alert
 *
 * @param {Object} props - The properties for the EditProtocolForm component.
 * @param {string} props.protocolId - The ID of the protocol to edit.
 * @param {function} props.onSuccess - Optional callback function to be called on successful edit.
 *
 * @returns {JSX.Element} The EditProtocolForm component.
 * @example
 * <EditProtocolForm />
 */

function EditProtocolForm() {
  const { protocolId } = useParams();
  const navigate = useNavigate();
  const { data: oneProtocol } = useGetOneProtocol(protocolId?.toString() ?? "");
  const { mutateAsync: editProtocol, isPending } = useEditProtocol(
    protocolId?.toString() ?? "",
    () => {
      form.reset();
      setTagInput("");
    }
  );

  const [tagInput, setTagInput] = useState("");
  const form = useForm<CreateProtocolSchemaType>({
    resolver: zodResolver(createProtocolSchema),
    defaultValues: {
      title: oneProtocol?.data?.title ?? "",
      content: oneProtocol?.data?.content ?? "",
      tags:
        oneProtocol?.data?.tags?.map((tag: Tags) =>
          typeof tag === "string" ? tag : tag.tag
        ) ?? [],
    },
  });

  useEffect(() => {
    if (oneProtocol?.data) {
      form.reset({
        title: oneProtocol.data.title ?? "",
        content: oneProtocol.data.content ?? "",
        tags:
          oneProtocol.data.tags?.map((tag: Tags) =>
            typeof tag === "string" ? tag : tag.tag
          ) ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneProtocol?.data]);

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !form.getValues("tags").includes(trimmedTag)) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleBack = () => {
    // Logic to navigate back, e.g., using a history hook or context
    navigate(-1);
  };

  const handleSubmit = async (values: CreateProtocolSchemaType) => {
    try {
      await toast.promise(editProtocol(values), {
        loading: "Editing protocol...",
        success: "Protocol edited successfully!",
        error: "Error editing protocol.",
      });
    } catch (error) {
      console.error("Error editing protocol:", error);
      toast.error("Failed to edit protocol. Please try again.");
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ">
              <FileText className="size-3 md:size-4" />
              <p className="text-base md:text-lg">Edit Protocol</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Protocol Title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="text-xs md:text-sm">
                Protocol Title
              </Label>
              <FormInput
                name="title"
                placeholder="e.g., Morning Meditation & Breathwork Protocol"
                className="text-xs md:text-sm"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="tags" className="text-xs md:text-sm">
                  Tags (Optional)
                </Label>
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="w-full">
                    <Input
                      type="text"
                      id="tags"
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyPress}
                      className="text-xs md:text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addTag}
                  >
                    <Plus className="size-3 md:size-4" />
                  </Button>
                </div>
              </div>
              {form.watch("tags").length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.watch("tags").map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer flex items-center gap-1"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="size-3 md:size-4" />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs md:text-sm text-muted-foreground">
                Add relevant tags like "meditation", "nutrition", "exercise" to
                help others find your protocol
              </p>
            </div>

            {/* Protocol Content */}
            <div className="flex flex-col gap-2">
              <FormTextArea
                label="Protocol Content"
                name="content"
                placeholder="Describe the protocol in detail..."
              />
              <p className="text-xs md:text-sm text-muted-foreground">
                Provide comprehensive details about your protocol including
                instructions, benefits, and precautions
              </p>
            </div>

            {/* Guidelines */}
            <Alert>
              <Info className="size-3 md:size-4" />
              <AlertDescription className="text-xs md:text-sm">
                <strong>Protocol Guidelines:</strong> Share evidence-based
                protocols with clear instructions. Include benefits, duration,
                frequency, and any precautions. Avoid medical advice and always
                recommend consulting healthcare professionals for serious
                conditions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            className="text-xs md:text-sm"
            onClick={handleBack}
          >
            <ArrowLeft className="size-3 md:size-4" />
            Back
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader className="size-3 md:size-4 animate-spin" />
                <span className="text-xs md:text-sm">Editing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="size-3 md:size-4" />
                <p className="text-xs md:text-sm">Edit Protocol</p>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { EditProtocolForm };
