import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useHeaderStore } from '@/store/header-store';

/**
 * Navigation Component
 * @description Navigation
 *
 * components used
 * - Link
 * - cn
 *
 * @param {object} props - The props for the navigation.
 * @param {LinksType[]} props.links - The links for the navigation.
 * @param {boolean} props.mobile - Whether the navigation is mobile.
 *
 * @returns {JSX.Element} The Navigation component.
 */

interface LinksType {
  label: string;
  to: string;
}

interface NavigationProps {
  links: LinksType[];
  mobile?: boolean;
}

function Navigation({ links, mobile }: NavigationProps) {
  const location = useLocation();
  const active = location.pathname;
  const { setIsOpen } = useHeaderStore();

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <main
      id='links'
      className={cn(
        'flex items-center gap-4',
        mobile && 'flex-col items-start'
      )}
    >
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className={cn(
            'text-gray-700 hover:text-[#2563eb] text-sm md:text-base',
            active === link.to && 'text-[#2563eb] font-semibold'
          )}
          onClick={handleClick}
        >
          {link.label}
        </Link>
      ))}
    </main>
  );
}

export { Navigation, type LinksType };
