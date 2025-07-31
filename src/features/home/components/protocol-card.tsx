import { Calendar, MessageSquare, Star, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import DeleteButton from '@/components/delete-button';
import EditButton from '@/components/edit-button';
import { Badge } from '@/components/ui/badge/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PathName } from '@/models/path-enums';
import { useAuthStore } from '@/store/auth-store';

import type { Protocols } from '@/models/protocols';

/**
 * ProtocolCard Component
 * @description Displays a card for each protocol with details and actions.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - Badge
 * - EditButton
 * - DeleteButton
 *
 * @param {Object} props - The properties for the ProtocolCard component.
 * @param {Protocols[]} props.protocol - The protocol data to display.
 * @param {string} [props.height='fit'] - The height of the card ('fit' or 'full').
 * @param {boolean} [props.actions=false] - Whether to show edit/delete actions.
 * @param {function} [props.onDelete] - Function to call when delete is clicked.
 * @param {boolean} [props.isDeleting=false] - Whether the delete action is in progress.
 *
 * @returns {JSX.Element} The ProtocolCard component.
 * @example
 * <ProtocolCard protocol={protocolData} height="full" actions={true} onDelete={handleDelete} isDeleting={isDeleting} />
 */

interface ProtocolCardProps {
  protocol: Protocols[];
  height?: 'fit' | 'full';
  actions?: boolean;
  onDelete?: (protocolId: number) => void;
  isDeleting?: boolean;
}

function ProtocolCard({
  protocol,
  height = 'fit',
  actions = false,
  onDelete,
  isDeleting = false,
}: ProtocolCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleEdit = (protocolId: number) => {
    navigate(`${PathName.PROTOCOLS}/${protocolId}/edit`);
  };

  return (
    <>
      {protocol.map((protocol) => (
        <Card
          key={protocol.id}
          className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer ${
            height === 'fit' ? 'max-h-fit' : 'max-h-full'
          }`}
        >
          <CardHeader>
            <header className='flex-1 flex flex-col gap-2'>
              <section className='flex items-center justify-between gap-2'>
                <Link to={`${PathName.PROTOCOLS}/${protocol.id}`}>
                  <h3 className='font-semibold text-base md:text-lg leading-tight hover:text-blue-500 hover:underline transition-colors'>
                    {protocol.title}
                  </h3>
                </Link>
                {actions && user?.name === protocol.author && (
                  <div className='flex items-center gap-2'>
                    <EditButton onClick={() => handleEdit(protocol.id)} />
                    <DeleteButton
                      loading={isDeleting}
                      onDelete={() => onDelete?.(protocol.id)}
                    />
                  </div>
                )}
              </section>
              <section className='flex md:items-center flex-col md:flex-row gap-2 text-xs md:text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <User className='size-3 md:size-4' />
                  <span className='text-xs md:text-sm text-muted-foreground'>
                    {protocol.author}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='size-3 md:size-4' />
                  <span className='text-xs md:text-sm text-muted-foreground'>
                    {new Date(protocol.created_at).toLocaleDateString()}
                  </span>
                </div>
              </section>
            </header>
          </CardHeader>

          <CardContent className='w-full break-words flex flex-col gap-4'>
            <p className='text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3'>
              {protocol.content}
            </p>
            <section className='flex flex-wrap gap-2'>
              {protocol.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant='secondary'
                  className='text-xs'
                >
                  {tag.tag}
                </Badge>
              ))}
            </section>
            <section className='flex items-center justify-between pt-2 border-t border-gray-100'>
              <div className='flex md:items-center flex-col md:flex-row gap-2 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Star className='size-3 md:size-4 fill-yellow-400 text-yellow-400' />
                  {protocol.reviews_count <= 0 && (
                    <span className='text-xs md:text-sm text-muted-foreground'>
                      No rating
                    </span>
                  )}
                  <span className='font-medium text-xs md:text-sm text-muted-foreground'>
                    {protocol.reviews_avg_rating}
                  </span>
                  <span className='text-xs md:text-sm text-muted-foreground'>
                    ({protocol.reviews_count} reviews)
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <MessageSquare className='size-3 md:size-4 ' />
                  <span className='text-xs md:text-sm text-muted-foreground'>
                    {protocol.threads_count} discussions
                  </span>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export { ProtocolCard };
