import { TrendingUp } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { PopularTags } from '@/features/home/components/popular-tags';
import { Search } from '@/features/home/components/search';

/**
 * DashboardFilters Component
 * @description Displays a dashboard filter section with search and trending tags.
 *
 * components used:
 * - Card
 * - Search
 * - PopularTags
 * - TrendingUp icon from lucide-react
 *
 * @returns {JSX.Element} The DashboardFilters component.
 *
 * @example
 * <DashboardFilters />
 */

function DashboardFilters() {
  return (
    <Card className='p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
      <main className='w-full flex flex-col justify-center gap-6 max-w-lg mx-auto'>
        <section
          id='filter-header'
          className='text-center flex flex-col gap-4'
        >
          <h2 className='text-lg md:text-2xl font-bold'>
            What are you looking for?
          </h2>
          <p className='text-gray-600  text-sm md:text-lg'>
            Search protocols, discussions, or browse by topic
          </p>
        </section>
        <section
          id='search-filter'
          className='w-full'
        >
          <Search />
        </section>
        <section
          id='trending-searches'
          className='flex flex-col gap-4'
        >
          <div className='flex items-center justify-center gap-2'>
            <TrendingUp className='w-5 h-5 text-gray-600' />
            <span className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>
              Trending Searches
            </span>
          </div>
          <PopularTags />
        </section>
      </main>
    </Card>
  );
}

export { DashboardFilters };
