"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

const clientNav = [
    { name: "Dashboard", path: "/client", icon: "📊" },
    { name: "Projects", path: "/client/projects", icon: "📁" },
    { name: "Subscriptions", path: "/client/subscriptions", icon: "💳" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile backdrop */}
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-[260px] border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6 dark:border-gray-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-sm font-bold">C</div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white">Client Portal</h2>
                        <p className="text-[10px] text-gray-400">TechVision Labs</p>
                    </div>
                </div>
                <nav className="p-4 space-y-1">
                    {clientNav.map((item) => {
                        const isActive = pathname === item.path || (item.path !== "/client" && pathname.startsWith(item.path));
                        return (
                            <Link key={item.path} href={item.path} onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
                                <span className="text-base">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <Link href="/" className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                        Switch to Admin
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="lg:ml-[260px]">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <ThemeToggleButton />
                        <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 dark:bg-teal-500/10">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">JM</div>
                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">James Mitchell</span>
                        </div>
                    </div>
                </header>
                <main className="p-4 mx-auto max-w-7xl md:p-6">{children}</main>
            </div>
        </div>
    );
}
