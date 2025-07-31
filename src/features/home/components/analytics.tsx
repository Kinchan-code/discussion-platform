import { FileText, MessageSquare, Star, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { useGetAnalytics } from '@/features/home/api/analytics';

/**
 * StatsCard Component
 *
 * @description A component that displays a single statistic card with an icon, value, and label.
 *
 * components used:
 * - Card: The main card component.
 * - Icon components from lucide-react: FileText, Users, MessageSquare, Star.
 *
 * @param {Object} props - The properties for the StatsCard component.
 * @param {React.ReactNode} props.icon - The icon to display in the card.
 * @param {number} props.stats - The numeric value to display in the card.
 * @param {string} props.statName - The label for the statistic.
 * @returns {JSX.Element} The StatsCard component.
 *
 * @example
 * <StatsCard
 *   icon={<FileText className='size-5 md:size-6 text-blue-500' />}
 *   stats={42}
 *   statName="Active Protocols"
 * />
 */

interface StatsCardProps {
  icon: React.ReactNode;
  stats: number;
  statName: string;
}

function StatsCard({ icon, stats, statName }: StatsCardProps) {
  return (
    <Card className='rounded-md cursor-pointer'>
      <main className='flex flex-col items-center justify-center gap-2 p-2 px-6'>
        <section id='stat-icon'>{icon}</section>
        <section id='stat-number'>
          <p className='font-bold text-lg md:text-xl'>{stats}</p>
        </section>
        <section
          id='stat-name'
          className='text-sm text-center md:text-base text-muted-foreground'
        >
          {statName}
        </section>
      </main>
    </Card>
  );
}

function Analytics() {
  const { data: analytics } = useGetAnalytics();

  const stats: StatsCardProps[] = [
    {
      icon: <FileText className='size-5 md:size-6 text-blue-500' />,
      stats: analytics?.data.active_protocols ?? 0,
      statName: 'Active Protocols',
    },
    {
      icon: <Users className='size-5 md:size-6 text-green-500' />,
      stats: analytics?.data.community_members ?? 0,
      statName: 'Community Members',
    },
    {
      icon: <MessageSquare className='size-5 md:size-6 text-violet-500' />,
      stats: analytics?.data.discussions ?? 0,
      statName: 'Discussions',
    },
    {
      icon: <Star className='size-5 md:size-6 text-yellow-500' />,
      stats: analytics?.data.avg_rating ?? 0,
      statName: 'Avg. Rating',
    },
  ];

  return (
    <main className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          stats={stat.stats}
          statName={stat.statName}
        />
      ))}
    </main>
  );
}

export { Analytics };
