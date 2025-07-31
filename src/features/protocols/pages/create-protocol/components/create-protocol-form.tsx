import { ArrowLeft, FileText, Info, Loader, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormTextArea } from '@/components/ui/form-textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateProtocol } from '@/features/protocols/pages/create-protocol/api/create-protocol';
import {
  createProtocolSchema,
  type CreateProtocolSchemaType,
} from '@/features/protocols/pages/create-protocol/schema/create-protocol-schema';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * CreateProtocolForm Component
 * @description Form for creating a new protocol with title, content, and tags.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - FormInput
 * - FormTextArea
 * - Input
 * - Button
 * - Badge
 * - Alert
 *
 * @param {object} props - The properties for the CreateProtocolForm component.
 * @param {string} props.placeholder - The placeholder for the input fields.
 * @param {string} props.className - The class name for the form.
 * @param {function} props.onSubmit - The function to be called on form submission.
 * @param {boolean} props.isPending - Whether the form submission is in progress.
 * @param {function} props.onBack - The function to be called when the back button is clicked.
 * @param {function} props.onTagAdd - The function to be called when a tag is added.
 * @param {function} props.onTagRemove - The function to be called when a tag is removed.
 * @param {string} props.tagInput - The current value of the tag input field.
 * @param {function} props.setTagInput - The function to set the value of the tag input field.
 * @param {function} props.handleTagInputKeyPress - The function to handle key press events in the tag input field.
 *
 * @returns {JSX.Element} The CreateProtocolForm component.
 *
 * @example
 * <CreateProtocolForm />
 */

function CreateProtocolForm() {
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();
  const { mutateAsync: createProtocol, isPending } = useCreateProtocol(() => {
    // This runs after successful API call
    form.reset(); // Resets all form fields to default values
    setTagInput(''); // Clears the tag input field
  });
  const form = useForm<CreateProtocolSchemaType>({
    resolver: zodResolver(createProtocolSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  });

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !form.getValues('tags').includes(trimmedTag)) {
      const currentTags = form.getValues('tags');
      form.setValue('tags', [...currentTags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
      await toast.promise(createProtocol(values), {
        loading: 'Creating protocol...',
        success: 'Protocol created successfully!',
        error: 'Error creating protocol.',
      });
    } catch (error) {
      console.error('Error creating protocol:', error);
      toast.error('Failed to create protocol. Please try again.');
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 '>
              <FileText className='size-3 md:size-4' />
              <p className='text-base md:text-lg'>New Protocol</p>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {/* Protocol Title */}
            <div className='flex flex-col gap-2'>
              <Label
                htmlFor='title'
                className='text-xs md:text-sm'
              >
                Protocol Title
              </Label>
              <FormInput
                name='title'
                placeholder='e.g., Morning Meditation & Breathwork Protocol'
                className='text-xs md:text-sm'
              />
            </div>

            {/* Tags */}
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2 w-full'>
                <Label
                  htmlFor='tags'
                  className='text-xs md:text-sm'
                >
                  Tags (Optional)
                </Label>
                <div className='flex items-center justify-between gap-2 w-full'>
                  <div className='w-full'>
                    <Input
                      type='text'
                      id='tags'
                      placeholder='Add a tag...'
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyPress}
                      className='text-xs md:text-sm'
                    />
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={addTag}
                  >
                    <Plus className='size-3 md:size-4' />
                  </Button>
                </div>
              </div>
              {form.watch('tags').length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {form.watch('tags').map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='cursor-pointer flex items-center gap-1'
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className='size-3 md:size-4' />
                    </Badge>
                  ))}
                </div>
              )}
              <p className='text-xs md:text-sm text-muted-foreground'>
                Add relevant tags like "meditation", "nutrition", "exercise" to
                help others find your protocol
              </p>
            </div>

            {/* Protocol Content */}
            <div className='flex flex-col gap-2'>
              <FormTextArea
                label='Protocol Content'
                name='content'
                placeholder='Describe the protocol in detail...'
              />
              <p className='text-xs md:text-sm text-muted-foreground'>
                Provide comprehensive details about your protocol including
                instructions, benefits, and precautions
              </p>
            </div>

            {/* Guidelines */}
            <Alert>
              <Info className='size-3 md:size-4' />
              <AlertDescription className='text-xs md:text-sm'>
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
        <div className='flex justify-between'>
          <Button
            type='button'
            variant='outline'
            className='text-xs md:text-sm'
            onClick={handleBack}
          >
            <ArrowLeft className='size-3 md:size-4' />
            Back
          </Button>

          <Button type='submit'>
            {isPending ? (
              <div className='flex items-center gap-2'>
                <Loader className='size-3 md:size-4 animate-spin' />
                <span className='text-xs md:text-sm'>Creating...</span>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <FileText className='size-3 md:size-4' />
                <p className='text-xs md:text-sm'>Create Protocol</p>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { CreateProtocolForm };
