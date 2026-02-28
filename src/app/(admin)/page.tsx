"use client";

import React from "react";
import Link from "next/link";
import { clients, projects, employees } from "@/data/mockData";
import {
  GroupIcon,
  FolderIcon,
  TaskIcon,
  ArrowUpIcon,
  ArrowRightIcon,
} from "@/icons/index";

const allTasks = projects.flatMap((p) => p.tasks);

const stats = [
  {
    title: "Total Clients",
    value: clients.length,
    change: "+12%",
    positive: true,
    icon: <GroupIcon />,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Active Projects",
    value: projects.filter((p) => p.status === "active").length,
    change: "+8%",
    positive: true,
    icon: <FolderIcon />,
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Tasks In Progress",
    value: allTasks.filter((t) => t.status === "in-progress").length,
    change: "+24%",
    positive: true,
    icon: <TaskIcon />,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Tasks Completed",
    value: allTasks.filter((t) => t.status === "done").length,
    change: "+32%",
    positive: true,
    icon: <TaskIcon />,
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function Dashboard() {
  const recentTasks = [...allTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s an overview of your workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <GroupIcon />
            View Clients
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
          >
            <FolderIcon />
            View Projects
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-7">
        {/* Recent Projects */}
        <div className="xl:col-span-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
              Active Projects
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {projects
              .filter((p) => p.status === "active")
              .slice(0, 4)
              .map((project) => {
                const client = clients.find((c) => c.id === project.clientId);
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90 truncate">
                        {project.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {client?.company} • Due{" "}
                        {new Date(project.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-8">
                          {project.progress}%
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]
                          }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="xl:col-span-3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
              Recent Tasks
            </h2>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentTasks.map((task) => {
              const assignee = employees.find(
                (e) => e.id === task.assigneeId
              );
              return (
                <div
                  key={task.id}
                  className="px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white/90 truncate">
                        {task.title}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {assignee?.name}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]
                        }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Overview */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
            Team Overview
          </h2>
          <Link
            href="/employees"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            View All <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-0 divide-y divide-gray-100 dark:divide-gray-800 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-3 xl:grid-cols-6">
          {employees.map((emp) => {
            const employeeTasks = allTasks.filter(
              (t) => t.assigneeId === emp.id
            );
            const activeTasks = employeeTasks.filter(
              (t) => t.status !== "done"
            ).length;
            const statusColor =
              emp.status === "available"
                ? "bg-emerald-500"
                : emp.status === "busy"
                  ? "bg-amber-500"
                  : emp.status === "away"
                    ? "bg-gray-400"
                    : "bg-gray-300";

            return (
              <div
                key={emp.id}
                className="px-6 py-5 text-center hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="relative mx-auto mb-3 h-12 w-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-semibold text-sm">
                    {emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-900 ${statusColor}`}
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90">
                  {emp.name}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {emp.role}
                </p>
                <p className="mt-2 text-xs">
                  <span className="font-medium text-gray-900 dark:text-white/80">
                    {activeTasks}
                  </span>
                  <span className="text-gray-400"> active tasks</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
