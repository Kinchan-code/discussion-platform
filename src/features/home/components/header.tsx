import { LogOut, Menu, User, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button/button';
import { Separator } from '@/components/ui/separator';
import { Create } from '@/features/home/components/create';
import {
  type LinksType,
  Navigation,
} from '@/features/home/components/navigation';
import { ProfileMenu } from '@/features/home/components/profile-menu';
import { Search } from '@/features/home/components/search';
import { useLogout } from '@/features/login/api/logout';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { cn } from '@/lib/utils';
import { PathName } from '@/models/path-enums';
import { useHeaderStore } from '@/store/header-store';

/**
 * Header Component
 * @description Main header for the application, includes navigation and user actions.
 *
 * components used:
 * - Button
 * - Navigation
 * - ProfileMenu
 * - Create
 * - Search
 *
 * @param {Object} props - The properties for the Header component.
 * @param {boolean} props.isOpen - Controls the open state of the header.
 * @param {function} props.toggleOpen - Function to toggle the open state of the header.
 * @param {function} props.setIsOpen - Function to set the open state of the header.
 * @param {boolean} props.isAuthenticated - Indicates if the user is authenticated.
 * @param {function} props.handleSignIn - Function to handle sign-in action.
 * @param {function} props.handleLogout - Function to handle logout action.
 * @param {function} props.handleNavigateToHome - Function to navigate to the home page.
 *
 * @returns {JSX.Element} The Header component.
 *
 * @example
 * <Header />
 */

const links: LinksType[] = [
  { label: 'Protocols', to: PathName.PROTOCOLS },
  { label: 'Discussions', to: PathName.THREADS },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, toggleOpen, setIsOpen } = useHeaderStore();
  const { isAuthenticated } = useProtectedAction();
  const { mutateAsync: logout } = useLogout();
  const dashboard = location.pathname === PathName.HOMEPAGE;

  const handleNavigateToHome = () => {
    navigate(PathName.HOMEPAGE);
    setIsOpen(false);
  };

  const handleSignIn = () => {
    navigate(PathName.LOGIN);
    setIsOpen(false);
  };

  const handleClickLinks = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      toast.promise(logout(), {
        loading: 'Logging out...',
        success: 'Logged out successfully',
        error: 'Logout failed',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleToggleMobileActions = () => {
    toggleOpen();
  };

  return (
    <main className='flex flex-col p-4 h-full justify-center max-w-7xl mx-auto w-full gap-4 '>
      <section
        id='web-view'
        className='flex items-center justify-between gap-4'
      >
        <div
          id='app-name'
          className='cursor-pointer'
          onClick={handleNavigateToHome}
        >
          <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>
            Protocol Hub
          </h1>
        </div>
        {!dashboard && (
          <div
            id='web-search-input'
            className='hidden lg:block'
          >
            <Search />
          </div>
        )}

        <div
          id='user-actions'
          className='hidden lg:flex items-center gap-4'
        >
          <Navigation links={links} />
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <Button
              variant='outline'
              onClick={handleSignIn}
            >
              Sign in
            </Button>
          )}

          <Create />
        </div>
        <div
          id='mobile-actions'
          className='lg:hidden'
        >
          <div className='relative w-4 h-4'>
            <X
              className={cn(
                'size-4 absolute inset-0 transition-all duration-200',
                isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
              )}
              onClick={handleToggleMobileActions}
            />
            <Menu
              className={cn(
                'size-4 absolute inset-0 transition-all duration-200',
                isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
              )}
              onClick={handleToggleMobileActions}
            />
          </div>
        </div>
      </section>
      {isOpen && (
        <section id='mobile-actions'>
          <Separator className='mb-4' />
          <div className='flex flex-col gap-4'>
            {!dashboard && <Search />}
            <div className='px-2'>
              <Navigation
                links={links}
                mobile
              />
            </div>
            <Separator />
            {isAuthenticated ? (
              <div
                id='links-buttons'
                className='flex flex-col gap-2'
              >
                <Link
                  to={PathName.USER_PROTOCOLS}
                  className='flex items-center gap-2 text-gray-700 text-sm md:text-base'
                  onClick={handleClickLinks}
                >
                  <User className='size-4' /> Profile
                </Link>
                <Link
                  to={PathName.HOMEPAGE}
                  className='flex items-center gap-2 text-gray-700 text-sm md:text-base'
                  onClick={handleLogout}
                >
                  <LogOut className='size-4' /> Logout
                </Link>
              </div>
            ) : (
              <Button
                variant='outline'
                onClick={handleSignIn}
                className='w-full'
              >
                Sign in
              </Button>
            )}
            <Create />
          </div>
        </section>
      )}
    </main>
  );
}

export default Header;
