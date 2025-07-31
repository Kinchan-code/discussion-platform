/**
 * Header component for the protocols page.
 * @description Header component for the protocols page.
 *
 * @returns {JSX.Element} The Header component.
 * @example
 * <Header />
 */

function Header() {
  return (
    <header className='text-center'>
      <h1 className='text-xl md:text-3xl font-bold mb-4'>All Protocols</h1>
      <p className='text-sm md:text-lg text-gray-600 max-w-2xl mx-auto'>
        Discover evidence-based healing and wellness protocols shared by our
        community
      </p>
    </header>
  );
}

export { Header };
