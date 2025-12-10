import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginForm from "@/features/login/components/login-form";
import { PathName } from "@/enums/path-enums";
import GoBackButton from "@/components/go-back-button";

/**
 * Login Component
 * @description Renders the login page with a form and a button to create an account.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - LoginForm
 * - Button
 *
 * @returns {JSX.Element} The Login component.
 * @example
 * <Login />
 */

function Login() {
  const navigate = useNavigate();
  const handleCreateAccount = () => {
    navigate(PathName.REGISTER); // Navigate to the registration page
  };

  return (
    <main className="min-h-screen flex flex-col justify-center bg-[#f9fafb] p-6">
      <Card className="max-w-sm mx-auto w-full p-4">
        <div>
          <GoBackButton />
        </div>
        <CardHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-xl md:text-2xl font-extrabold">Protocol Hub</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <section className="flex flex-col gap-6">
            <LoginForm />
            <section className="flex flex-col gap-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-xs md:text-sm bg-white text-muted-foreground">
                    New to Protocol Hub?
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleCreateAccount}
                className="w-full text-xs md:text-sm"
              >
                Create Account
              </Button>
            </section>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

export default Login;
