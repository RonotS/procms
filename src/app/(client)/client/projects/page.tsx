"use client";

import React from "react";
import Link from "next/link";
import { projects, employees } from "@/data/mockData";

const CURRENT_CLIENT_ID = "client-1";

const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function ClientProjects() {
    const clientProjects = projects.filter((p) => p.clientIds.includes(CURRENT_CLIENT_ID));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Projects</h1>
                <p className="mt-1 text-sm text-gray-500">View the progress of all your active projects</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {clientProjects.map((project) => {
                    const done = project.tasks.filter((t) => t.status === "done").length;
                    const total = project.tasks.length;
                    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
                    const projectEmployees = [...new Set(project.tasks.map((t) => t.assigneeId))].map((id) => employees.find((e) => e.id === id)).filter(Boolean);

                    return (
                        <Link key={project.id} href={`/client/projects/${project.id}`}
                            className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-800">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span>
                                    </div>
                                    <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">{project.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                                </div>
                                <svg className="h-5 w-5 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </div>

                            {/* Progress */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>{done}/{total} tasks completed</span>
                                    <span className="font-medium">{progress}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex -space-x-2">
                                    {projectEmployees.slice(0, 3).map((e) => (
                                        <div key={e!.id} className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                            {e!.name.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                    ))}
                                </div>
                                <span>Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
