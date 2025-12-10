import {
  Home,
  SearchIcon,
  FileText,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PathName } from "@/enums/path-enums";
import { Search } from "@/features/home/components/search";

/**
 * NotFound Component
 *
 * @description A component displayed when a requested page is not found (404).
 * It provides options for the user to navigate back or to other relevant pages.
 *
 * components used:
 * - Search: A search input component for finding content.
 * - Button: For navigation actions.
 * - Card: For displaying the "What would you like to do?" section.
 *
 * @param {boolean} isOpen - Controls the open state of the modal.
 * @param {function} setOpen - Function to set the open state of the modal.
 * @param {function} handleGoBack - Function to navigate back to the previous page.
 * @param {function} handleGoHome - Function to navigate to the homepage.
 *
 * @returns The NotFound component.
 * @example
 * <NotFound />
 */

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(PathName.HOMEPAGE);
  };

  const handleBrowseProtocols = () => {
    navigate(PathName.PROTOCOLS);
  };

  const handleViewDiscussions = () => {
    navigate(PathName.THREADS);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <section className="flex flex-col gap-8 max-w-2xl mx-auto text-center p-6">
        {/* 404 Illustration */}
        <div className="relative">
          <span className="text-8xl md:text-9xl font-bold text-gray-200 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-20 md:size-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <SearchIcon className="size-12 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl md:text-4xl font-bold">Page Not Found</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              What would you like to do?
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start bg-transparent"
                onClick={handleGoHome}
              >
                <Home className="size-4" />
                Go to Homepage
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start bg-transparent"
                onClick={handleBrowseProtocols}
              >
                <FileText className="size-4" />
                Browse Protocols
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start bg-transparent"
                onClick={handleViewDiscussions}
              >
                <MessageSquare className="size-4" />
                View Discussions
              </Button>
              <Search placeholder="Search" />
            </div>
          </CardContent>
        </Card>

        {/* Go Back Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
