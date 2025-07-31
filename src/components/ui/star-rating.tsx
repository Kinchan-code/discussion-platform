import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * StarRating Component
 *
 * @description
 * A customizable star rating component that allows users to select a rating from 1 to maxRating stars.
 * It supports hover effects, read-only mode, and displays the current rating.
 *
 * components used:
 * - Star (from lucide-react)
 *
 * @param value - Current rating value (1 to maxRating).
 * @param onChange - Callback function to handle rating changes.
 * @param maxRating - Maximum number of stars (default: 5).
 * @param size - Size of the stars ('sm', 'md', 'lg').
 * @param readonly - If true, makes the component read-only.
 * @param showLabel - If true, displays the current rating label.
 * @param className - Optional Tailwind CSS classes for custom styling.
 *
 * @returns A star rating component with interactive features.
 */

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  maxRating = 5,
  size = 'md',
  readonly = false,
  showLabel = true,
  className,
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (rating: number) => {
    if (readonly) return;
    onChange(rating);
  };

  const handleStarHover = (rating: number) => {
    if (readonly) return;
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    if (readonly) return;
    setHoveredStar(0);
  };

  const getStarStyle = (starIndex: number) => {
    const currentRating = hoveredStar || value;
    return starIndex <= currentRating
      ? 'fill-yellow-400 text-yellow-400'
      : 'text-gray-300';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'size-4';
      case 'md':
        return 'size-6';
      case 'lg':
        return 'size-8';
      default:
        return 'size-6';
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 items-center', className)}>
      <div className='flex items-center gap-2'>
        {Array.from({ length: maxRating }, (_, index) => index + 1).map(
          (star) => (
            <Star
              key={star}
              className={cn(
                getSizeClass(),
                'transition-colors duration-200',
                !readonly && 'cursor-pointer hover:scale-110',
                getStarStyle(star)
              )}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
            />
          )
        )}
      </div>
      {showLabel && value > 0 && (
        <p className='md:text-sm text-xs text-muted-foreground'>
          {readonly
            ? `Rated ${value} out of ${maxRating} stars`
            : `You rated this ${value} out of ${maxRating} stars`}
        </p>
      )}
    </div>
  );
}
