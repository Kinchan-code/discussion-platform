import { useSearchParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge/badge';
import { useGetPopularTags } from '@/features/home/api/popular-tags';
import { useSearchDialogStore } from '@/store/search-dialog-store';

/**
 * PopularTags Component
 * @description Displays a list of popular tags that can be clicked to filter discussions.
 *
 * components used:
 * - Badge
 *
 * @param {Object} props - The properties for the PopularTags component.
 * @param {boolean} props.isOpen - Controls the open state of the search dialog.
 * @param {function} props.setIsOpen - Function to set the open state of the search dialog.
 * @param {string} props.activeTag - The currently active tag.
 * @param {function} props.setActiveTag - Function to set the active tag.
 *
 * @returns {JSX.Element} The PopularTags component.
 * @example
 * <PopularTags />
 */

function PopularTags() {
  const [params, setParams] = useSearchParams();
  const { data: popularTags, isLoading } = useGetPopularTags();
  const { setIsOpen } = useSearchDialogStore();

  const handleTagClick = (tag: string) => {
    if (!tag) {
      params.delete('q');
      setParams(params);
      setIsOpen(false);
    } else {
      params.set('q', tag);
      setParams(params);
      setIsOpen(true);
    }
  };

  return (
    <main className='flex flex-col items-center justify-center gap-2 cursor-pointer '>
      {isLoading ? (
        <div className='flex flex-wrap gap-2 '>
          <p className='text-muted-foreground text-xs animate-pulse'>
            loading popular tags...
          </p>
        </div>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {popularTags?.data.map((tag) => (
            <Badge
              key={tag.id}
              variant='outline'
              className='rounded-xl hover:bg-blue-500 hover:text-white'
              onClick={() => handleTagClick(tag.tag)}
            >
              {tag.tag}
            </Badge>
          ))}
        </div>
      )}
    </main>
  );
}

export { PopularTags };
