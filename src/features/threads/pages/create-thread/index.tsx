import GoBackButton from '@/components/go-back-button';
import { CreateThreadForm } from '@/features/threads/pages/create-thread/components/create-thread-form';

/**
 * CreateThreadPage Component
 *
 * @description This component renders the page for creating a new thread.
 *
 * components used:
 * - GoBackButton: A button to navigate back to the previous page.
 * - CreateThreadForm: A form for creating a new thread.
 *
 * @returns {JSX.Element} The CreateThreadPage component.
 * @example
 * <CreateThreadPage />
 */

function CreateThreadPage() {
  return (
    <main className='flex flex-col gap-4 p-2'>
      <section>
        <GoBackButton />
      </section>
      <div className='flex flex-col gap-2'>
        <h1 className='text-base md:text-3xl font-bold mb-2'>
          Start a Discussion
        </h1>
        <p className='text-muted-foreground text-xs md:text-sm'>
          Share your thoughts, ask questions, or discuss protocols with the
          community
        </p>
      </div>
      <CreateThreadForm />
    </main>
  );
}

export default CreateThreadPage;
