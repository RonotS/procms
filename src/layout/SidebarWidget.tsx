import React from "react";

const SidebarWidget: React.FC = () => {
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gradient-to-b from-brand-50 to-brand-100 px-4 pb-5 pt-5 text-center dark:from-brand-500/10 dark:to-brand-500/5">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/90">
        ProCMS
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Client & Project Management
      </p>
      <a
        href="/"
        className="flex items-center justify-center rounded-lg bg-brand-500 p-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600"
      >
        Dashboard
      </a>
    </div>
  );
};

export default SidebarWidget;
