"use client";

import React, { useState } from "react";
import Link from "next/link";
import { projects as initialProjects, clients, employees, Project } from "@/data/mockData";
import { ArrowRightIcon, PlusIcon } from "@/icons/index";
import { AddProjectModal } from "@/components/AddProjectModal";

const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function ProjectsPage() {
    const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showAddProject, setShowAddProject] = useState(false);

    const filteredProjects = projectsList.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || project.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                        Projects
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Track progress across all client projects
                    </p>
                </div>
                <button
                    onClick={() => setShowAddProject(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Project
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="relative flex-1">
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
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {["all", "active", "on-hold", "completed", "cancelled"].map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filterStatus === status
                                    ? "bg-brand-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {status === "on-hold"
                                    ? "On Hold"
                                    : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => {
                    const projectClients = project.clientIds.map((cid) => clients.find((c) => c.id === cid)).filter(Boolean);
                    const projectEmployees = [
                        ...new Set(project.tasks.map((t) => t.assigneeId)),
                    ]
                        .map((id) => employees.find((e) => e.id === id))
                        .filter(Boolean);
                    const completedTasks = project.tasks.filter(
                        (t) => t.status === "done"
                    ).length;

                    return (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="group flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-brand-200 dark:hover:border-brand-800"
                        >
                            {/* Color banner */}
                            <div
                                className={`h-1.5 rounded-t-2xl ${project.status === "active"
                                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                    : project.status === "on-hold"
                                        ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                        : project.status === "completed"
                                            ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                            : "bg-gradient-to-r from-red-400 to-red-600"
                                    }`}
                            />

                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]
                                                    }`}
                                            >
                                                {project.status}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                •
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {projectClients.map((c) => c!.company).join(", ")}
                                            </span>
                                        </div>
                                        <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                    <ArrowRightIcon className="ml-4 h-5 w-5 shrink-0 text-gray-300 group-hover:text-brand-500 transition-colors" />
                                </div>

                                {/* Progress */}
                                <div className="mt-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {completedTasks} of {project.tasks.length} tasks
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

                                {/* Footer */}
                                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <div className="flex -space-x-2">
                                        {projectEmployees.slice(0, 3).map((emp) => (
                                            <div
                                                key={emp!.id}
                                                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-brand-600 text-[10px] font-medium text-white dark:border-gray-900"
                                                title={emp!.name}
                                            >
                                                {emp!.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                        ))}
                                        {projectEmployees.length > 3 && (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px] font-medium text-gray-600 dark:border-gray-900 dark:bg-gray-700 dark:text-gray-300">
                                                +{projectEmployees.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        <span>
                                            Due{" "}
                                            {new Date(project.dueDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <AddProjectModal
                isOpen={showAddProject}
                onClose={() => setShowAddProject(false)}
                onAdd={(project) => setProjectsList([project, ...projectsList])}
            />
        </div>
    );
}
