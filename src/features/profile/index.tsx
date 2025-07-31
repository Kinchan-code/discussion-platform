import { FileText, Mail, MessageSquare, Star, User } from 'lucide-react';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetUserStatistics } from '@/features/profile/api/user-statistics';
import EditProfile from '@/features/profile/components/edit-profile';
import { cn, formatDate } from '@/lib/utils';
import { PathName } from '@/models/path-enums';
import { useAuthStore } from '@/store/auth-store';

/**
 * Options for the activity selector dropdown.
 *
 * @type {Array<{ value: string; label: string; icon: React.ComponentType }>}
 */

const activitiesOptions = [
  {
    value: 'protocols',
    label: 'Protocols',
    icon: FileText,
  },
  {
    value: 'threads',
    label: 'Discussions',
    icon: MessageSquare,
  },
  {
    value: 'comments',
    label: 'Comments',
    icon: MessageSquare,
  },
  {
    value: 'replies',
    label: 'Replies',
    icon: MessageSquare,
  },
  {
    value: 'reviews',
    label: 'Reviews',
    icon: Star,
  },
];

/**
 * Profile Component
 * @description Displays user profile information and activity overview.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - Select
 * - SelectContent
 * - SelectItem
 * - SelectTrigger
 * - SelectValue
 *
 * @param {Object} props - The properties for the Profile component.
 * @param {string} props.contentType - The type of content to display (protocols, discussions, comments, replies, reviews).
 * @param {function} props.onChange - The function to call when the content type changes.
 * @param {boolean} props.isLoading - Whether the data is currently being loaded.
 * @param {boolean} props.isError - Whether there was an error loading the data.
 * @param {Object} props.data - The data to display in the profile.
 * @param {string} props.data.name - The name of the user.
 * @param {string} props.data.email - The email of the user.
 * @param {string} props.data.created_at - The date the user was created.
 * @param {Array} props.statistics - The statistics to display in the activity overview.
 * @param {Array<{ label: string; value: number; icon: React.ComponentType; color: string; textColor: string }>} props.statistics - The statistics to display in the activity overview.
 *
 * @returns {JSX.Element} The Profile component.
 *
 * @example
 * <Profile />
 */

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { data } = useGetUserStatistics();

  const statistics = [
    {
      label: 'Protocols',
      value: data?.data.total_protocols || 0,
      icon: FileText,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Discussions',
      value: data?.data.total_threads || 0,
      icon: MessageSquare,
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Comments',
      value: data?.data.total_comments || 0,
      icon: MessageSquare,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Reviews',
      value: data?.data.total_reviews || 0,
      icon: Star,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
  ];

  // Derive content from current pathname
  const content = useMemo(() => {
    const pathname = location.pathname;
    switch (pathname) {
      case PathName.USER_PROTOCOLS:
        return 'protocols';
      case PathName.USER_THREADS:
        return 'threads';
      case PathName.USER_COMMENTS:
        return 'comments';
      case PathName.USER_REPLIES:
        return 'replies';
      case PathName.USER_REVIEWS:
        return 'reviews';
      default:
        return 'protocols'; // Default fallback
    }
  }, [location.pathname]);

  const handleChange = (value: string) => {
    switch (value) {
      case 'protocols':
        navigate(PathName.USER_PROTOCOLS);
        break;
      case 'threads':
        navigate(PathName.USER_THREADS);
        break;
      case 'comments':
        navigate(PathName.USER_COMMENTS);
        break;
      case 'replies':
        navigate(PathName.USER_REPLIES);
        break;
      case 'reviews':
        navigate(PathName.USER_REVIEWS);
        break;
      default:
        navigate(PathName.USER_PROTOCOLS);
        break;
    }
  };
  return (
    <main className='flex flex-col h-full gap-8 p-4'>
      {/* Profile Header */}
      <section className='flex flex-col h-full lg:flex-row gap-8'>
        {/* User Info */}
        <Card className='w-full flex-1 md:w-1/3 '>
          <CardContent>
            <section className='flex flex-col gap-4 h-full justify-center'>
              <div className='flex items-center gap-2 justify-between'>
                <p className='text-base md:text-xl font-bold'>{user?.name}</p>
                <EditProfile />
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Mail className='size-3 md:size-4' />
                <span className='text-xs md:text-sm text-muted-foreground'>
                  {user?.email}
                </span>
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <User className='size-3 md:size-4' />
                <span className='text-xs md:text-sm text-muted-foreground'>
                  Member since{' '}
                  {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                </span>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className='w-full h-full md:w-2/3 '>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <main className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {statistics.map((stat) => (
                <section
                  key={stat.label}
                  className={cn(
                    'flex flex-col gap-1 items-center justify-center p-4 rounded-lg',
                    stat.color
                  )}
                >
                  <stat.icon className={cn('size-6', stat.textColor)} />
                  <p className='text-lg font-bold'>{stat.value}</p>
                  <p className='text-xs text-muted-foreground'>{stat.label}</p>
                </section>
              ))}
            </main>
          </CardContent>
        </Card>
      </section>

      {/* Activity Section */}
      <Card>
        <CardHeader>
          <section className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <CardTitle>
              <h1 className='text-base md:text-lg'>Recent Activity</h1>
            </CardTitle>

            {/* Activity Selector Dropdown */}
            <div className='w-full sm:w-auto'>
              <Select
                value={content}
                onValueChange={handleChange}
              >
                <SelectTrigger className='w-full text-xs md:text-sm'>
                  <SelectValue
                    placeholder='Select activity type'
                    className='text-xs md:text-sm'
                  />
                </SelectTrigger>
                <SelectContent>
                  {activitiesOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      <div className='flex items-center gap-2'>
                        <option.icon className='size-3 md:size-4' />
                        <span className='text-xs md:text-sm'>
                          {option.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </CardHeader>

        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </main>
  );
}

export default Profile;
