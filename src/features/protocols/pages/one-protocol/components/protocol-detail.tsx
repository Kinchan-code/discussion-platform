import { AlertCircleIcon, Calendar, Star, Tag, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useDeleteProtocol } from '@/api/delete-protocol';
import DeleteButton from '@/components/delete-button';
import EditButton from '@/components/edit-button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetOneProtocol } from '@/features/protocols/pages/one-protocol/api/one-protocol';
import { PathName } from '@/models/path-enums';
import { useAuthStore } from '@/store/auth-store';

/**
 * ProtocolDetail Component
 * @description Displays detailed information about a protocol.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - Badge
 * - Button
 * - DeleteButton
 * - EditButton
 * - AlertDialog
 *
 * @returns {JSX.Element} The ProtocolDetail component.
 * @example
 * <ProtocolDetail />
 */

export function ProtocolDetail() {
  const navigate = useNavigate();
  const { protocolId } = useParams();
  const { user } = useAuthStore();
  const { mutateAsync: deleteProtocol, isPending } = useDeleteProtocol(() => {
    navigate(PathName.PROTOCOLS);
  });
  const {
    data: oneProtocol,
    isFetching,
    isFetched,
    isError,
    error,
  } = useGetOneProtocol(protocolId || '');

  if (isFetched) {
    localStorage.setItem('protocol', oneProtocol?.data.title || '');
  }

  // Handle error state first (before loading check)
  if (isError) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent className='flex flex-col items-center gap-8 w-max-sm'>
          <AlertDialogHeader className='flex flex-col items-center gap-4'>
            <AlertDialogTitle className='text-center text-red-500'>
              <AlertCircleIcon className='size-12 md:size-20' />
            </AlertDialogTitle>
            <AlertDialogDescription className='text-xs md:text-sm text-center text-muted-foreground'>
              <p className='flex flex-col gap-4'>
                <span>
                  {error?.message ||
                    'This protocol may have been deleted or does not exist.'}
                </span>
                <span>
                  {error.status_code === 404
                    ? 'The protocol you are looking for does not exist. You can browse other protocols or create a new one.'
                    : 'This protocol may have been deleted or does not exist. Please try again later.'}
                </span>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex justify-center items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button onClick={() => navigate(PathName.PROTOCOLS)}>
              View Protocols
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (isFetching || !oneProtocol) {
    return (
      <section className='h-[calc(100%-10%)] w-full flex flex-col gap-2'>
        <div className='h-3/4'>
          <Skeleton className='h-40 w-full rounded-xl' />
        </div>
        <div className='flex flex-col gap-2 h-1/4'>
          <Skeleton className='h-8 w-1/2 rounded-xl' />
          <Skeleton className='h-8 w-full rounded-xl' />
        </div>
      </section>
    );
  }

  const handleEdit = () => {
    // Navigate to edit protocol page
    navigate(`${PathName.PROTOCOLS}/${protocolId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await toast.promise(deleteProtocol(Number(protocolId)), {
        loading: 'Deleting protocol...',
        success: 'Protocol deleted successfully!',
        error: 'Error deleting protocol',
      });
    } catch (error) {
      console.error('Error deleting protocol:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <section className='flex flex-col  sm:flex-row sm:items-start sm:justify-between gap-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-4 justify-between'>
              <h1 className='text-base md:text-xl lg:text-2xl font-bold leading-tight'>
                {oneProtocol?.data.title}
              </h1>
              {user?.name === oneProtocol?.data.author && (
                <div className='flex items-center gap-2'>
                  <EditButton onClick={handleEdit} />
                  <DeleteButton
                    loading={isPending}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>

            <div className='flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600'>
              <div className='flex items-center gap-1 text-xs md:text-sm'>
                <User className='size-3 md:size-4' />
                <span>{oneProtocol?.data.author}</span>
              </div>
              <div className='flex items-center gap-1 text-xs md:text-sm'>
                <Calendar className='size-3 md:size-4' />
                <span>
                  Created:{' '}
                  {new Date(
                    oneProtocol?.data.created_at ?? ''
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center gap-1 text-xs md:text-sm'>
                <Star className='size-3 md:size-4 fill-yellow-400 text-yellow-400' />
                <span className='font-medium text-xs md:text-sm'>
                  {oneProtocol?.data.rating ?? 0}
                </span>
                <span className='flex items-center text-xs md:text-sm text-muted-foreground'>
                  ({oneProtocol?.data.reviews_count} reviews)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mt-4'>
          {oneProtocol?.data.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant='secondary'
            >
              <Tag className='size-3 md:size-4' />
              {tag.tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className='prose prose-sm max-w-none'>
          <div className='whitespace-pre-wrap text-gray-600 text-xs md:text-sm leading-relaxed'>
            {oneProtocol?.data.content}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
