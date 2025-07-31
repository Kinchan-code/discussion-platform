/**
 * Header component for the threads feature.
 *
 * @description This component displays the header for the threads section, including a title and description.
 *
 * @returns {JSX.Element} The Header component.
 * @example
 * <Header />
 */

function Header() {
  return (
    <header className='text-center'>
      <h1 className='text-xl md:text-3xl font-bold mb-4'>
        Community Discussions
      </h1>
      <p className='text-sm md:text-lg text-gray-600 max-w-2xl mx-auto'>
        Join conversations about protocols, share experiences, and get advice
        from the community
      </p>
    </header>
  );
}

export { Header };
