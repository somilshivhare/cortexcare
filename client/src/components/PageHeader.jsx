import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const PageHeader = ({ title, breadcrumbs = [], actions, onBack, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200/60 dark:border-neutral-800/60 mb-6 ${className}`}>
      <div className="space-y-1.5">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.path ? (
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {crumb.name}
                  </button>
                ) : (
                  <span>{crumb.name}</span>
                )}
                {idx !== breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-neutral-350" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
        </div>
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
