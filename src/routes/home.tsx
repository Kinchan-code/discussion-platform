import { AuthModal } from '@/components/auth-modal';
import HomeFeature from '@/features/home';

/**
 * Home Component
 * @description This component serves as the main entry point for the home page of the application.
 *
 * components used:
 * - HomeFeature: The main feature component for the home page.
 * - AuthModal: The authentication modal component for login and registration.
 *
 * @returns {JSX.Element} The Home component.
 * @example
 * <Home />
 */

function Home() {
  return (
    <>
      <HomeFeature /> <AuthModal />
    </>
  );
}

export default Home;
