"use client";

import React from "react";
import { subscriptions, projects } from "@/data/mockData";

const CURRENT_CLIENT_ID = "client-1";

const billingIcons: Record<string, string> = { monthly: "📅", hourly: "⏱️", "one-time": "💰", milestone: "🏁" };

export default function ClientSubscriptions() {
    const clientSubs = subscriptions.filter((s) => s.clientId === CURRENT_CLIENT_ID);
    const totalPaid = clientSubs.reduce((sum, s) => sum + s.amountPaid, 0);
    const totalOutstanding = clientSubs.reduce((sum, s) => sum + (s.totalValue - s.amountPaid), 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions & Billing</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your subscriptions and view payment history</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500">Total Paid</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">${totalPaid.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500">Outstanding</p>
                    <p className="mt-1 text-2xl font-bold text-amber-600">${totalOutstanding.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500">Active Subscriptions</p>
                    <p className="mt-1 text-2xl font-bold text-teal-600">{clientSubs.filter((s) => s.status === "active").length}</p>
                </div>
            </div>

            {/* Subscriptions list */}
            <div className="space-y-4">
                {clientSubs.map((sub) => {
                    const paidPercent = sub.totalValue > 0 ? Math.round((sub.amountPaid / sub.totalValue) * 100) : 0;
                    const linkedProject = sub.projectId ? projects.find((p) => p.id === sub.projectId) : null;
                    return (
                        <div key={sub.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">{billingIcons[sub.billingType]}</span>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{sub.name}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{sub.billingType.replace("-", " ")} billing</p>
                                        {linkedProject && <p className="mt-1 text-xs text-teal-600 dark:text-teal-400">🔗 {linkedProject.name}</p>}
                                        {sub.notes && <p className="mt-2 text-xs text-gray-400 italic">{sub.notes}</p>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sub.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : sub.status === "paused" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>{sub.status}</span>
                                    <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">${sub.totalValue.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">total value</p>
                                </div>
                            </div>
                            {/* Progress */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>${sub.amountPaid.toLocaleString()} paid</span>
                                    <span>{paidPercent}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className={`h-full rounded-full transition-all ${paidPercent === 100 ? "bg-emerald-500" : "bg-teal-500"}`} style={{ width: `${paidPercent}%` }} />
                                </div>
                            </div>
                            {/* Milestones */}
                            {sub.billingType === "milestone" && sub.milestones && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Milestones</p>
                                    {sub.milestones.map((ms, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2.5 dark:border-gray-800">
                                            <div className="flex items-center gap-3">
                                                <span className={`h-2.5 w-2.5 rounded-full ${ms.status === "paid" ? "bg-emerald-500" : ms.status === "pending" ? "bg-amber-400" : "bg-gray-300"}`} />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{ms.label}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-500">{ms.percentage}%</span>
                                                <span className="font-medium text-gray-900 dark:text-white">${ms.amount.toLocaleString()}</span>
                                                <span className={`text-xs font-medium capitalize ${ms.status === "paid" ? "text-emerald-600" : ms.status === "pending" ? "text-amber-600" : "text-gray-400"}`}>{ms.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
