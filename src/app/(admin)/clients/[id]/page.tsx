"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    clients,
    projects,
    employees,
} from "@/data/mockData";
import {
    ArrowRightIcon,
    ChevronLeftIcon,
} from "@/icons/index";

const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function ClientDetailPage() {
    const { id } = useParams();
    const client = clients.find((c) => c.id === id);
    const clientProjects = projects.filter((p) => p.clientId === id);

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white/90">
                    Client Not Found
                </h2>
                <Link href="/clients" className="mt-4 text-brand-500 hover:text-brand-600">
                    ← Back to Clients
                </Link>
            </div>
        );
    }

    const totalTasks = clientProjects.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = clientProjects.reduce(
        (sum, p) => sum + p.tasks.filter((t) => t.status === "done").length,
        0
    );

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/clients"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
                <ChevronLeftIcon className="h-4 w-4" />
                Back to Clients
            </Link>

            {/* Client Header Card */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-5">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-2xl shadow-lg">
                                {client.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                                        {client.name}
                                    </h1>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${client.status === "active"
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {client.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
                                    {client.company}
                                </p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {client.industry}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/projects`}
                            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
                        >
                            View All Projects
                        </Link>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 dark:border-gray-800 sm:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                                    {client.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                                <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                                    {client.phone}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
                                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                                    {client.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-0 divide-x divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800 sm:grid-cols-4">
                    <div className="px-6 py-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white/90">
                            {clientProjects.length}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Projects
                        </p>
                    </div>
                    <div className="px-6 py-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {clientProjects.filter((p) => p.status === "active").length}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Active
                        </p>
                    </div>
                    <div className="px-6 py-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white/90">
                            {totalTasks}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Tasks
                        </p>
                    </div>
                    <div className="px-6 py-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white/90">
                            ${(client.totalRevenue / 1000).toFixed(0)}k
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Revenue
                        </p>
                    </div>
                </div>
            </div>

            {/* Client Projects */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white/90">
                    Projects ({clientProjects.length})
                </h2>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {clientProjects.map((project) => {
                        const projectEmployees = [
                            ...new Set(project.tasks.map((t) => t.assigneeId)),
                        ]
                            .map((id) => employees.find((e) => e.id === id))
                            .filter(Boolean);

                        return (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-brand-200 dark:hover:border-brand-800"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                {project.name}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]
                                                    }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                    <ArrowRightIcon className="ml-4 h-5 w-5 shrink-0 text-gray-400 group-hover:text-brand-500 transition-colors" />
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Progress
                                        </span>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {project.progress}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <div className="flex -space-x-2">
                                        {projectEmployees.slice(0, 4).map((emp) => (
                                            <div
                                                key={emp!.id}
                                                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-medium text-white dark:border-gray-900"
                                                title={emp!.name}
                                            >
                                                {emp!.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                        ))}
                                        {projectEmployees.length > 4 && (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600 dark:border-gray-900 dark:bg-gray-700 dark:text-gray-300">
                                                +{projectEmployees.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{project.tasks.length} tasks</span>
                                        <span>•</span>
                                        <span>
                                            Due{" "}
                                            {new Date(project.dueDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
