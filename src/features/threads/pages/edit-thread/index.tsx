import GoBackButton from '@/components/go-back-button';
import { EditThreadForm } from '@/features/threads/pages/edit-thread/components/edit-thread-form';

/**
 * EditThreadPage Component
 *
 * @description This component renders the page for editing a discussion thread.
 *
 * components used:
 * - GoBackButton: A button to navigate back to the previous page.
 * - EditThreadForm: A form for editing the thread details.
 *
 * @returns {JSX.Element} The EditThreadPage component.
 *
 * @example
 * <EditThreadPage />
 */

function EditThreadPage() {
  return (
    <main className='flex flex-col gap-4 p-2'>
      <section>
        <GoBackButton />
      </section>
      <div className='flex flex-col gap-2'>
        <h1 className='text-base md:text-3xl font-bold mb-2'>
          Edit a Discussion
        </h1>
        <p className='text-muted-foreground text-xs md:text-sm'>
          Share your thoughts, ask questions, or discuss protocols with the
          community by editing this discussion thread
        </p>
      </div>
      <EditThreadForm />
    </main>
  );
}

export default EditThreadPage;
