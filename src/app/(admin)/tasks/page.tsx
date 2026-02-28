"use client";

import React, { useState } from "react";
import Link from "next/link";
import { projects, clients, employees } from "@/data/mockData";

const allTasks = projects.flatMap((p) =>
    p.tasks.map((t) => ({
        ...t,
        projectName: p.name,
        clientIds: p.clientIds,
    }))
);

const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    high: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    urgent: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const statusLabels: Record<string, string> = {
    backlog: "Backlog",
    todo: "To Do",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
};

const statusDotColors: Record<string, string> = {
    backlog: "bg-gray-400",
    todo: "bg-blue-500",
    "in-progress": "bg-amber-500",
    review: "bg-purple-500",
    done: "bg-emerald-500",
};

export default function TasksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterAssignee, setFilterAssignee] = useState("all");
    const [viewMode, setViewMode] = useState<"table" | "cards">("table");

    const filteredTasks = allTasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.projectName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority =
            filterPriority === "all" || task.priority === filterPriority;
        const matchesStatus =
            filterStatus === "all" || task.status === filterStatus;
        const matchesAssignee =
            filterAssignee === "all" || task.assigneeId === filterAssignee;
        return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                        Tasks
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        View and filter tasks across all projects
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                    <button
                        onClick={() => setViewMode("table")}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "table"
                            ? "bg-brand-500 text-white"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12h.375m-.375 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode("cards")}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "cards"
                            ? "bg-brand-500 text-white"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                fill="currentColor"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:bg-gray-900"
                        >
                            <option value="all">All Statuses</option>
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:bg-gray-900"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                        <select
                            value={filterAssignee}
                            onChange={(e) => setFilterAssignee(e.target.value)}
                            className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:bg-gray-900"
                        >
                            <option value="all">All Assignees</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-white/90">{filteredTasks.length}</span> tasks
            </p>

            {/* Table View */}
            {viewMode === "table" && (
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Task
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Project
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Assignee
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Due Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredTasks.map((task) => {
                                    const assignee = employees.find(
                                        (e) => e.id === task.assigneeId
                                    );
                                    return (
                                        <tr
                                            key={task.id}
                                            className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                                                    {task.title}
                                                </p>
                                                {task.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {task.tags.slice(0, 2).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/projects/${task.projectId}`}
                                                    className="text-sm text-brand-500 hover:text-brand-600 transition-colors"
                                                >
                                                    {task.projectName}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${statusDotColors[task.status] || "bg-gray-400"
                                                            }`}
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                        {statusLabels[task.status] || task.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[task.priority]
                                                        }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {assignee ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[9px] font-medium text-white">
                                                            {assignee.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </div>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {assignee.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {task.dueDate
                                                        ? new Date(task.dueDate).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )
                                                        : "—"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Cards View */}
            {viewMode === "cards" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTasks.map((task) => {
                        const assignee = employees.find(
                            (e) => e.id === task.assigneeId
                        );

                        return (
                            <div
                                key={task.id}
                                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200 hover:shadow-md"
                            >
                                {task.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {task.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90">
                                    {task.title}
                                </h3>
                                <Link
                                    href={`/projects/${task.projectId}`}
                                    className="mt-1 inline-block text-xs text-brand-500 hover:text-brand-600 transition-colors"
                                >
                                    {task.projectName}
                                </Link>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {task.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className={`h-2 w-2 rounded-full ${statusDotColors[task.status] || "bg-gray-400"
                                                    }`}
                                            />
                                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                                {statusLabels[task.status] || task.status}
                                            </span>
                                        </div>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityColors[task.priority]
                                                }`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>
                                    {assignee && (
                                        <div
                                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[9px] font-medium text-white"
                                            title={assignee.name}
                                        >
                                            {assignee.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
