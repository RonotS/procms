import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <div className="mx-auto w-full max-w-[472px] text-center">
        <div className="mb-8 flex items-center justify-center">
          <span className="text-[120px] font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent leading-none">
            404
          </span>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90">
          Page Not Found
        </h1>

        <p className="mb-8 text-base text-gray-500 dark:text-gray-400">
          We can&apos;t seem to find the page you are looking for!
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - ProCMS
      </p>
    </div>
  );
}
