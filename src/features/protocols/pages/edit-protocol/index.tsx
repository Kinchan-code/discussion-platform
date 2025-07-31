import GoBackButton from '@/components/go-back-button';
import { EditProtocolForm } from '@/features/protocols/pages/edit-protocol/components/edit-protocol-form';

/**
 * EditProtocolPage Component
 * @description Page for editing a protocol
 *
 * components used:
 * - GoBackButton
 * - EditProtocolForm
 *
 * @returns {JSX.Element} The EditProtocolPage component.
 */

function EditProtocolPage() {
  return (
    <main className='flex flex-col gap-4 p-2'>
      <section>
        <GoBackButton />
      </section>
      <section className='flex flex-col gap-2'>
        <h1 className='text-base md:text-3xl font-bold mb-2'>Edit Protocol</h1>
        <p className='text-muted-foreground text-xs md:text-sm'>
          Share your knowledge with the community by editing this protocol
        </p>
      </section>
      <EditProtocolForm />
    </main>
  );
}

export default EditProtocolPage;
