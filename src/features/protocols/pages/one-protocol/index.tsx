import GoBackButton from '@/components/go-back-button';
import CommunityReviews from '@/features/protocols/pages/one-protocol/components/community-reviews';
import { ProtocolDetail } from '@/features/protocols/pages/one-protocol/components/protocol-detail';
import ProtocolThreadList from '@/features/protocols/pages/one-protocol/components/protocol-thread-list';

/**
 * OneProtocol Component
 *
 * @description This component renders the details of a single protocol, including its reviews and threads.
 *
 * components used:
 * - GoBackButton: A button to navigate back to the previous page.
 * - ProtocolDetail: Displays detailed information about the protocol.
 * - ProtocolThreadList: Lists the threads associated with the protocol.
 * - CommunityReviews: Displays community reviews for the protocol.
 *
 * @returns {JSX.Element} The OneProtocol component.
 *
 * @example
 * <OneProtocol />
 */

function OneProtocol() {
  return (
    <main className='flex h-full w-full flex-col gap-4'>
      <section>
        <GoBackButton />
      </section>
      <section className='w-full flex flex-col md:flex-row gap-4'>
        <div className='w-full h-full md:w-4/6 flex flex-col gap-4'>
          <ProtocolDetail />
          <ProtocolThreadList />
        </div>
        <div className='w-full h-full md:w-2/6 flex flex-col gap-4'>
          <CommunityReviews />
        </div>
      </section>
    </main>
  );
}

export default OneProtocol;
