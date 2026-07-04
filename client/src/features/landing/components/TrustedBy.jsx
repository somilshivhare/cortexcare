import React from 'react';

const TrustedBy = () => {
  const brands = [
    { name: 'Beacon Health Group' },
    { name: 'Aura Clinical Center' },
    { name: 'Apex Therapeutics' },
    { name: 'Verdant Medical Corp' },
    { name: 'Zenith Labs' },
  ];

  return (
    <section className="border-b border-neutral-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Trusted by leading healthcare centers & practitioners
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {brands.map((brand) => (
            <span
              key={brand.name}
              className="text-sm font-bold tracking-tight text-neutral-300 dark:text-neutral-600 select-none cursor-default hover:text-neutral-400 dark:hover:text-neutral-500 transition-colors"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
