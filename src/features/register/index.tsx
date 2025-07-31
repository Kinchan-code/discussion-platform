import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PathName } from '@/models/path-enums';

import RegisterForm from '@/features/register/components/register-form';
import GoBackButton from '@/components/go-back-button';

/**
 * Register Component
 * @description This component renders the registration form and handles navigation to the login page.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - RegisterForm
 *
 * @returns {JSX.Element} The Register component.
 * @example
 * <Register />
 */

function Register() {
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate(PathName.LOGIN);
  };

  return (
    <main className='min-h-screen flex flex-col justify-center bg-[#f9fafb] p-6'>
      <Card className='max-w-md mx-auto w-full p-4'>
        <div>
          <GoBackButton />
        </div>
        <CardHeader>
          <div className='flex flex-col gap-2 items-center justify-center'>
            <h1 className='text-lg md:text-2xl font-extrabold'>
              Join our Community
            </h1>
            <p className='text-sm md:text-base text-center text-muted-foreground'>
              Create your account to start sharing and discovering protocols
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <section className='flex flex-col gap-6'>
            <RegisterForm />
            <section className='flex flex-col gap-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 text-xs md:text-sm bg-white text-muted-foreground'>
                    Already have an account?
                  </span>
                </div>
              </div>
              <Button
                variant='outline'
                onClick={handleSignIn}
                className='w-full text-xs md:text-sm'
              >
                Sign in instead
              </Button>
            </section>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

export default Register;
