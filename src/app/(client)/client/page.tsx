"use client";

import React from "react";
import Link from "next/link";
import { clients, projects, subscriptions, employees } from "@/data/mockData";

const CURRENT_CLIENT_ID = "client-1"; // Simulating logged-in client

export default function ClientDashboard() {
    const client = clients.find((c) => c.id === CURRENT_CLIENT_ID)!;
    const clientProjects = projects.filter((p) => p.clientIds.includes(CURRENT_CLIENT_ID));
    const clientSubs = subscriptions.filter((s) => s.clientId === CURRENT_CLIENT_ID);
    const activeSubs = clientSubs.filter((s) => s.status === "active");
    const totalPaid = clientSubs.reduce((sum, s) => sum + s.amountPaid, 0);
    const totalOutstanding = clientSubs.reduce((sum, s) => sum + (s.totalValue - s.amountPaid), 0);
    const allTasks = clientProjects.flatMap((p) => p.tasks);
    const completedTasks = allTasks.filter((t) => t.status === "done").length;

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 p-8 text-white">
                <h1 className="text-2xl font-bold">Welcome back, {client.name.split(" ")[0]} 👋</h1>
                <p className="mt-1 text-teal-100">{client.company} • {client.industry}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold">{clientProjects.length}</p>
                        <p className="text-xs text-teal-200">Projects</p>
                    </div>
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold">{activeSubs.length}</p>
                        <p className="text-xs text-teal-200">Active Subs</p>
                    </div>
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold text-emerald-300">${totalPaid.toLocaleString()}</p>
                        <p className="text-xs text-teal-200">Total Paid</p>
                    </div>
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                        <p className="text-2xl font-bold text-amber-300">${totalOutstanding.toLocaleString()}</p>
                        <p className="text-xs text-teal-200">Outstanding</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Projects */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-white">Your Projects</h2>
                        <Link href="/client/projects" className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400">View All →</Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {clientProjects.slice(0, 4).map((project) => {
                            const done = project.tasks.filter((t) => t.status === "done").length;
                            const total = project.tasks.length;
                            return (
                                <Link key={project.id} href={`/client/projects/${project.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{project.name}</h3>
                                        <p className="mt-0.5 text-xs text-gray-500">{done}/{total} tasks done • Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                                    </div>
                                    <div className="ml-4 w-20">
                                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div className="h-full rounded-full bg-teal-500" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Subscriptions */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-white">Subscriptions</h2>
                        <Link href="/client/subscriptions" className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400">View All →</Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {clientSubs.map((sub) => {
                            const paidPercent = sub.totalValue > 0 ? Math.round((sub.amountPaid / sub.totalValue) * 100) : 0;
                            return (
                                <div key={sub.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{sub.name}</h3>
                                            <p className="text-xs text-gray-500 capitalize">{sub.billingType.replace("-", " ")}</p>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sub.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div className="h-full rounded-full bg-teal-500" style={{ width: `${paidPercent}%` }} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">{paidPercent}%</span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-400">${sub.amountPaid.toLocaleString()} / ${sub.totalValue.toLocaleString()}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Task Activity */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Task Progress Across Projects</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
                    {["backlog", "todo", "in-progress", "done"].map((status) => {
                        const count = allTasks.filter((t) => t.status === status).length;
                        const colors: Record<string, string> = { backlog: "text-gray-500", todo: "text-blue-500", "in-progress": "text-amber-500", done: "text-emerald-500" };
                        return (
                            <div key={status} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                <p className={`text-2xl font-bold ${colors[status]}`}>{count}</p>
                                <p className="text-xs text-gray-500 capitalize">{status.replace("-", " ")}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
