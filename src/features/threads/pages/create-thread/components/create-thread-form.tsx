import { ArrowLeft, Info, Loader, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormTextArea } from '@/components/ui/form-textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateThread } from '@/features/threads/pages/create-thread/api/create-thread';
import { useGetProtocolsFilters } from '@/features/threads/pages/create-thread/api/get-select-protocols';
import {
  createThreadSchema,
  type CreateThreadSchemaType,
} from '@/features/threads/pages/create-thread/schema/create-thread-schema';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * CreateThreadForm Component
 * @description Form for creating a new discussion thread.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardTitle
 * - Form
 * - FormField
 * - FormItem
 * - FormLabel
 * - FormControl
 * - FormMessage
 * - FormInput
 * - FormTextArea
 * - Select
 * - SelectContent
 * - SelectItem
 * - SelectTrigger
 * - SelectValue
 * - Button
 * - Alert
 * - AlertDescription
 *
 *
 * @param {CreateThreadSchemaType} form - The form data for creating a thread.
 * @param {function} onSubmit - The function to call when the form is submitted.
 * @param {function} onBack - The function to call when the back button is clicked.
 *
 * @returns {JSX.Element} The CreateThreadForm component.
 * @example
 * <CreateThreadForm />
 */

function CreateThreadForm() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data: protocols } = useGetProtocolsFilters();
  const { mutateAsync: createThread, isPending } = useCreateThread(() => {
    // This runs after successful API call
    form.reset(); // Resets all form fields to default values
  });

  // Get initial protocolId from URL params
  const initialProtocolId = params.get('protocol') || '';

  const form = useForm<CreateThreadSchemaType>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      protocol_id: initialProtocolId,
      title: '',
      body: '',
    },
  });

  // Function to update URL when select value changes
  const handleProtocolChange = (value: string) => {
    form.setValue('protocol_id', value);

    // Update URL search params
    const newParams = new URLSearchParams(params);
    if (value) {
      newParams.set('protocol', value);
    } else {
      newParams.delete('protocol');
    }
    setParams(newParams);
  };

  const selectData = protocols?.data.map((protocol) => ({
    value: protocol.id,
    label: protocol.title,
  }));

  const handleSubmit = async (values: CreateThreadSchemaType) => {
    try {
      await toast.promise(createThread(values), {
        loading: 'Creating discussion...',
        success: 'Discussion created successfully!',
        error: 'Error creating discussion.',
      });
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast.error('Failed to create discussion. Please try again.');
      return;
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
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
              <MessageSquare className='size-3 md:size-4' />
              <p className='text-base md:text-lg'>New Discussion</p>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {/* Select Protocol */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='protocol_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='select-protocol'>
                      Related Protocol
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={handleProtocolChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id='select-protocol'
                          className='w-full text-xs md:text-sm'
                        >
                          <SelectValue placeholder='Select a protocol' />
                        </SelectTrigger>
                        <SelectContent className='max-h-40 md:max-h-60'>
                          {selectData?.map((protocol) => (
                            <SelectItem
                              key={protocol.value}
                              value={protocol.value.toString()}
                              className='text-xs md:text-sm'
                            >
                              {protocol.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className='text-xs md:text-sm text-muted-foreground'>
                Link your discussion to a specific protocol, or leave blank for
                general discussion
              </p>
            </div>
            {/* Protocol Title */}
            <div className='flex flex-col gap-2'>
              <FormInput
                name='title'
                label='Discussion Title'
                placeholder='e.g., Morning Meditation & Breathwork Discussion'
                className='text-xs md:text-sm'
              />
            </div>

            {/* Thread Content */}
            <div className='flex flex-col gap-2'>
              <FormTextArea
                label='Your Message'
                name='body'
                placeholder='Share your thoughts, questions, or insights...'
              />

              <p className='text-xs md:text-sm text-muted-foreground'>
                Be specific and helpful. Include details about your experience
                or questions.
              </p>
            </div>

            {/* Guidelines */}
            <Alert>
              <Info className='size-3 md:size-4' />
              <AlertDescription className='text-xs md:text-sm'>
                <strong>Discussion Guidelines:</strong> Be respectful, stay on
                topic, and provide helpful information. Avoid medical advice and
                always consult healthcare professionals for serious concerns.
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

          <Button
            type='submit'
            disabled={isPending}
          >
            {isPending ? (
              <div className='flex items-center gap-2'>
                <Loader className='size-3 md:size-4 animate-spin' />
                <span className='text-xs md:text-sm'>Creating...</span>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <MessageSquare className='size-3 md:size-4' />
                <p className='text-xs md:text-sm'>Start Discussion</p>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { CreateThreadForm };
