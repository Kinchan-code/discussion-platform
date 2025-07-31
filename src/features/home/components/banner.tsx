/**
 * Banner Component
 *
 * @description A component that displays a banner with a title and description.
 *
 * components used:
 * - None
 *
 * @returns {JSX.Element} The Banner component.
 * @example
 * <Banner />
 */

function Banner() {
  return (
    <div
      id='banner'
      className='text-center p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg'
    >
      <h1 className='text-xl md:text-3xl font-bold mb-4'>
        Community Protocol Hub
      </h1>
      <p className='text-sm md:text-lg opacity-90 md:max-w-xl mx-auto'>
        Discover, share, and discuss evidence-based healing and wellness
        protocols with a community of practitioners and enthusiasts
      </p>
    </div>
  );
}

export { Banner };
