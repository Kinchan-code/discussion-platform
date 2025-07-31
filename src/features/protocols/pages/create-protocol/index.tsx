import GoBackButton from '@/components/go-back-button';
import { CreateProtocolForm } from '@/features/protocols/pages/create-protocol/components/create-protocol-form';

/**
 * CreateProtocolPage Component
 *
 * @description Page for creating a new protocol.
 *
 * components used:
 * - GoBackButton
 * - CreateProtocolForm
 *
 * @returns {JSX.Element} The CreateProtocolPage component.
 * @example
 * <CreateProtocolPage />
 */

function CreateProtocolPage() {
  return (
    <main className='flex flex-col gap-4 p-2'>
      <section>
        <GoBackButton />
      </section>
      <section className='flex flex-col gap-2'>
        <h1 className='text-base md:text-3xl font-bold mb-2'>
          Create New Protocol
        </h1>
        <p className='text-muted-foreground text-xs md:text-sm'>
          Share your knowledge with the community by creating a detailed
          protocol
        </p>
      </section>
      <CreateProtocolForm />
    </main>
  );
}

export default CreateProtocolPage;
