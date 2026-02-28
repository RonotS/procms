"use client";

import React from "react";
import Link from "next/link";
import { projects, employees } from "@/data/mockData";

const CURRENT_EMP_ID = "emp-1";

export default function EmployeeProjects() {
    const assignedProjects = projects.filter((p) => p.tasks.some((t) => t.assigneeId === CURRENT_EMP_ID));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
                <p className="mt-1 text-sm text-gray-500">Projects where you have assigned tasks</p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {assignedProjects.map((project) => {
                    const myTasks = project.tasks.filter((t) => t.assigneeId === CURRENT_EMP_ID);
                    const done = myTasks.filter((t) => t.status === "done").length;
                    const progress = myTasks.length > 0 ? Math.round((done / myTasks.length) * 100) : 0;
                    return (
                        <Link key={project.id} href={`/employee/projects/${project.id}`}
                            className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{project.name}</h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{done}/{myTasks.length} of my tasks done</span><span>{progress}%</span></div>
                                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-full rounded-full bg-violet-500" style={{ width: `${progress}%` }} /></div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
