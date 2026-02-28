"use client";

import React from "react";
import Link from "next/link";
import { projects, employees, eodReports } from "@/data/mockData";

const CURRENT_EMP_ID = "emp-1";

export default function EmployeeDashboard() {
    const employee = employees.find((e) => e.id === CURRENT_EMP_ID)!;
    const assignedProjects = projects.filter((p) => p.tasks.some((t) => t.assigneeId === CURRENT_EMP_ID));
    const myTasks = projects.flatMap((p) => p.tasks.filter((t) => t.assigneeId === CURRENT_EMP_ID));
    const todayReports = eodReports.filter((r) => r.employeeId === CURRENT_EMP_ID);
    const completed = myTasks.filter((t) => t.status === "done").length;
    const inProgress = myTasks.filter((t) => t.status === "in-progress").length;

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-8 text-white">
                <h1 className="text-2xl font-bold">Hey, {employee.name.split(" ")[0]} 🚀</h1>
                <p className="mt-1 text-violet-200">{employee.role} • {employee.department}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold">{myTasks.length}</p>
                        <p className="text-xs text-violet-200">Total Tasks</p>
                    </div>
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold text-amber-300">{inProgress}</p>
                        <p className="text-xs text-violet-200">In Progress</p>
                    </div>
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold text-emerald-300">{completed}</p>
                        <p className="text-xs text-violet-200">Completed</p>
                    </div>
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold">{assignedProjects.length}</p>
                        <p className="text-xs text-violet-200">Projects</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* My Tasks */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-white">My Active Tasks</h2>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-80 overflow-y-auto">
                        {myTasks.filter((t) => t.status !== "done").slice(0, 8).map((task) => {
                            const project = projects.find((p) => p.id === task.projectId);
                            const priorityColors: Record<string, string> = { high: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400", medium: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", low: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" };
                            return (
                                <div key={task.id} className="px-6 py-3">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</h3>
                                            <p className="mt-0.5 text-xs text-gray-500">{project?.name}</p>
                                        </div>
                                        <span className={`ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColors[task.priority]}`}>{task.priority}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Projects */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-white">My Projects</h2>
                        <Link href="/employee/projects" className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">View All →</Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {assignedProjects.map((project) => {
                            const myProjectTasks = project.tasks.filter((t) => t.assigneeId === CURRENT_EMP_ID);
                            const done = myProjectTasks.filter((t) => t.status === "done").length;
                            return (
                                <Link key={project.id} href={`/employee/projects/${project.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                                        <p className="mt-0.5 text-xs text-gray-500">{done}/{myProjectTasks.length} of my tasks done</p>
                                    </div>
                                    <svg className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Recent EOD Reports</h2>
                    <Link href="/employee/reports" className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">View All →</Link>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {todayReports.slice(0, 3).map((report) => {
                        const project = projects.find((p) => p.id === report.projectId);
                        return (
                            <div key={report.id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{project?.name}</h3>
                                        <p className="mt-0.5 text-xs text-gray-500">{new Date(report.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                                    </div>
                                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-500/10 dark:text-emerald-400">Submitted</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
