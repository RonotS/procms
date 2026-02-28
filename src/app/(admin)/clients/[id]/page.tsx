"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    clients,
    projects as initialProjects,
    employees,
    subscriptions as initialSubscriptions,
    Subscription,
    Project,
} from "@/data/mockData";
import { ArrowRightIcon, ChevronLeftIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import { Modal } from "@/components/ui/modal";
import { AddProjectModal } from "@/components/AddProjectModal";

const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    paused: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const billingTypeLabels: Record<string, { label: string; color: string; icon: string }> = {
    monthly: { label: "Monthly Retainer", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300", icon: "🔄" },
    hourly: { label: "Hourly Rate", color: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300", icon: "⏱" },
    "one-time": { label: "One-Time", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300", icon: "📋" },
    milestone: { label: "Milestone", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300", icon: "🏁" },
};

const milestoneStatusColors: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    invoiced: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    pending: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

export default function ClientDetailPage() {
    const { id } = useParams();
    const client = clients.find((c) => c.id === id);
    const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
    const clientProjects = projectsList.filter((p) => p.clientIds.includes(id as string));
    const [clientSubs, setClientSubs] = useState<Subscription[]>(
        initialSubscriptions.filter((s) => s.clientId === id)
    );
    const [showAddSub, setShowAddSub] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [expandedSub, setExpandedSub] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"subscriptions" | "projects">("subscriptions");

    const [newSub, setNewSub] = useState({
        name: "",
        billingType: "monthly" as Subscription["billingType"],
        monthlyRate: "",
        hourlyRate: "",
        estimatedHours: "",
        fixedAmount: "",
        milestoneCount: "2",
        milestoneLabels: ["50% Upfront", "50% On Completion"],
        notes: "",
        startDate: "",
        endDate: "",
        projectId: "",
    });

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white/90">Client Not Found</h2>
                <Link href="/clients" className="mt-4 text-brand-500 hover:text-brand-600">← Back to Clients</Link>
            </div>
        );
    }

    const totalTasks = clientProjects.reduce((sum, p) => sum + p.tasks.length, 0);
    const totalPaid = clientSubs.reduce((sum, s) => sum + s.amountPaid, 0);
    const totalOutstanding = clientSubs.reduce((sum, s) => sum + (s.totalValue - s.amountPaid), 0);

    const handleAddSub = () => {
        let totalValue = 0;
        let milestones: Subscription["milestones"];

        if (newSub.billingType === "monthly") {
            const rate = parseFloat(newSub.monthlyRate) || 0;
            totalValue = rate * 12;
        } else if (newSub.billingType === "hourly") {
            const rate = parseFloat(newSub.hourlyRate) || 0;
            const hours = parseFloat(newSub.estimatedHours) || 0;
            totalValue = rate * hours;
        } else if (newSub.billingType === "one-time") {
            totalValue = parseFloat(newSub.fixedAmount) || 0;
        } else if (newSub.billingType === "milestone") {
            const count = parseInt(newSub.milestoneCount) || 2;
            const perMilestone = 100 / count;
            totalValue = parseFloat(newSub.fixedAmount) || 0;
            milestones = newSub.milestoneLabels.slice(0, count).map((label, i) => ({
                label: label || `Milestone ${i + 1}`,
                percentage: Math.round(perMilestone),
                amount: Math.round(totalValue * perMilestone / 100),
                status: "pending" as const,
            }));
        }

        const sub: Subscription = {
            id: `sub-${Date.now()}`,
            clientId: client.id,
            name: newSub.name,
            billingType: newSub.billingType,
            status: "active",
            monthlyRate: newSub.billingType === "monthly" ? parseFloat(newSub.monthlyRate) || 0 : undefined,
            hourlyRate: newSub.billingType === "hourly" ? parseFloat(newSub.hourlyRate) || 0 : undefined,
            estimatedHours: newSub.billingType === "hourly" ? parseFloat(newSub.estimatedHours) || 0 : undefined,
            fixedAmount: newSub.billingType === "one-time" ? parseFloat(newSub.fixedAmount) || 0 : undefined,
            milestones,
            totalValue,
            amountPaid: 0,
            startDate: newSub.startDate || new Date().toISOString().split("T")[0],
            endDate: newSub.endDate || undefined,
            notes: newSub.notes,
            projectId: newSub.projectId || undefined,
        };

        setClientSubs([...clientSubs, sub]);
        setShowAddSub(false);
        setNewSub({ name: "", billingType: "monthly", monthlyRate: "", hourlyRate: "", estimatedHours: "", fixedAmount: "", milestoneCount: "2", milestoneLabels: ["50% Upfront", "50% On Completion"], notes: "", startDate: "", endDate: "", projectId: "" });
    };

    const handleDeleteSub = (subId: string) => {
        setClientSubs(clientSubs.filter((s) => s.id !== subId));
        setExpandedSub(null);
    };

    const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
    const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const updateMilestoneLabels = (count: number) => {
        const presets: Record<number, string[]> = {
            2: ["50% Upfront", "50% On Completion"],
            3: ["30% Deposit", "40% Mid-Project", "30% Final"],
            4: ["25% Deposit", "25% Phase 1", "25% Phase 2", "25% Final"],
        };
        const labels = presets[count] || Array.from({ length: count }, (_, i) => `Milestone ${i + 1}`);
        setNewSub({ ...newSub, milestoneCount: String(count), milestoneLabels: labels });
    };

    const renderBillingInfo = (sub: Subscription) => {
        switch (sub.billingType) {
            case "monthly":
                return (
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Rate:</span>
                        <span className="font-semibold text-gray-900 dark:text-white/90">{formatCurrency(sub.monthlyRate || 0)}/mo</span>
                        {sub.nextBillingDate && <>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-gray-500 dark:text-gray-400">Next billing: <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(sub.nextBillingDate)}</span></span>
                        </>}
                    </div>
                );
            case "hourly":
                return (
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Rate:</span>
                        <span className="font-semibold text-gray-900 dark:text-white/90">{formatCurrency(sub.hourlyRate || 0)}/hr</span>
                        {sub.estimatedHours && <>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-gray-500 dark:text-gray-400">Est. hours: <span className="font-medium text-gray-700 dark:text-gray-300">{sub.estimatedHours}</span></span>
                        </>}
                    </div>
                );
            case "one-time":
                return (
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Fixed Price:</span>
                        <span className="font-semibold text-gray-900 dark:text-white/90">{formatCurrency(sub.fixedAmount || sub.totalValue)}</span>
                    </div>
                );
            case "milestone":
                return (
                    <div className="space-y-2">
                        {sub.milestones?.map((m, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-white/[0.03]">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${m.status === "paid" ? "bg-emerald-500 text-white" : m.status === "invoiced" ? "bg-amber-500 text-white" : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300"}`}>
                                        {m.status === "paid" ? "✓" : i + 1}
                                    </span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{m.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white/90">{formatCurrency(m.amount)}</span>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${milestoneStatusColors[m.status]}`}>{m.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <Link href="/clients" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                <ChevronLeftIcon className="h-4 w-4" /> Back to Clients
            </Link>

            {/* Client Header Card */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-5">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-2xl shadow-lg">
                                {client.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">{client.name}</h1>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${client.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>{client.status}</span>
                                </div>
                                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">{client.company}</p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{client.industry}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowAddSub(true)} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors">
                            <PlusIcon className="h-4 w-4" /> Add Subscription
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 dark:border-gray-800 sm:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            </div>
                            <div><p className="text-xs text-gray-500 dark:text-gray-400">Email</p><p className="text-sm font-medium text-gray-900 dark:text-white/90">{client.email}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                                <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                            </div>
                            <div><p className="text-xs text-gray-500 dark:text-gray-400">Phone</p><p className="text-sm font-medium text-gray-900 dark:text-white/90">{client.phone}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
                                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            </div>
                            <div><p className="text-xs text-gray-500 dark:text-gray-400">Address</p><p className="text-sm font-medium text-gray-900 dark:text-white/90">{client.address}</p></div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-0 divide-x divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800 sm:grid-cols-5">
                    <div className="px-4 py-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white/90">{clientProjects.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                    </div>
                    <div className="px-4 py-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{clientSubs.filter((s) => s.status === "active").length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Active Subs</p>
                    </div>
                    <div className="px-4 py-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white/90">{totalTasks}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tasks</p>
                    </div>
                    <div className="px-4 py-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
                    </div>
                    <div className="px-4 py-4 text-center">
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalOutstanding)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Outstanding</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                <button onClick={() => setActiveTab("subscriptions")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === "subscriptions" ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}>
                    Subscriptions & Billing ({clientSubs.length})
                </button>
                <button onClick={() => setActiveTab("projects")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === "projects" ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}>
                    Projects ({clientProjects.length})
                </button>
            </div>

            {/* Subscriptions Tab */}
            {activeTab === "subscriptions" && (
                <div className="space-y-4">
                    {clientSubs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-white/[0.03]">
                            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No subscriptions yet</p>
                            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Add a subscription to start tracking billing for this client.</p>
                            <button onClick={() => setShowAddSub(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
                                <PlusIcon className="h-4 w-4" /> Add Subscription
                            </button>
                        </div>
                    ) : (
                        clientSubs.map((sub) => {
                            const isExpanded = expandedSub === sub.id;
                            const paidPercent = sub.totalValue > 0 ? Math.round((sub.amountPaid / sub.totalValue) * 100) : 0;
                            const bt = billingTypeLabels[sub.billingType];
                            const linkedProject = sub.projectId ? projectsList.find((p) => p.id === sub.projectId) : null;

                            return (
                                <div key={sub.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] transition-all hover:border-gray-300 dark:hover:border-gray-700">
                                    {/* Subscription Header */}
                                    <button onClick={() => setExpandedSub(isExpanded ? null : sub.id)} className="w-full p-5 text-left">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-xl">{bt.icon}</span>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white/90 truncate">{sub.name}</h3>
                                                        <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${bt.color}`}>{bt.label}</span>
                                                        <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[sub.status]}`}>{sub.status}</span>
                                                    </div>
                                                    {linkedProject && (
                                                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Linked to: {linkedProject.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white/90">{formatCurrency(sub.totalValue)}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{formatCurrency(sub.amountPaid)} paid</p>
                                                </div>
                                                <svg className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all" style={{ width: `${paidPercent}%` }} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">{paidPercent}% paid</span>
                                        </div>
                                    </button>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800 space-y-4">
                                            {renderBillingInfo(sub)}
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                                                <div><span className="text-gray-500 dark:text-gray-400">Start Date</span><p className="font-medium text-gray-900 dark:text-white/90">{formatDate(sub.startDate)}</p></div>
                                                {sub.endDate && <div><span className="text-gray-500 dark:text-gray-400">End Date</span><p className="font-medium text-gray-900 dark:text-white/90">{formatDate(sub.endDate)}</p></div>}
                                                <div><span className="text-gray-500 dark:text-gray-400">Outstanding</span><p className="font-medium text-amber-600 dark:text-amber-400">{formatCurrency(sub.totalValue - sub.amountPaid)}</p></div>
                                            </div>
                                            {sub.notes && (
                                                <div className="rounded-lg bg-gray-50 p-3 dark:bg-white/[0.03]">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{sub.notes}</p>
                                                </div>
                                            )}
                                            <div className="flex justify-end">
                                                <button onClick={() => handleDeleteSub(sub.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors">
                                                    <TrashBinIcon className="h-3.5 w-3.5" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
                <div className="space-y-5">
                    <div className="flex justify-end">
                        <button onClick={() => setShowAddProject(true)} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors">
                            <PlusIcon className="h-4 w-4" /> Add Project
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {clientProjects.map((project) => {
                            const projectEmployees = [...new Set(project.tasks.map((t) => t.assigneeId))].map((eid) => employees.find((e) => e.id === eid)).filter(Boolean);
                            return (
                                <Link key={project.id} href={`/projects/${project.id}`} className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-brand-200 dark:hover:border-brand-800">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{project.name}</h3>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                                        </div>
                                        <ArrowRightIcon className="ml-4 h-5 w-5 shrink-0 text-gray-400 group-hover:text-brand-500 transition-colors" />
                                    </div>
                                    <div className="mt-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{project.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500" style={{ width: `${project.progress}%` }} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                                        <div className="flex -space-x-2">
                                            {projectEmployees.slice(0, 4).map((emp) => (
                                                <div key={emp!.id} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-medium text-white dark:border-gray-900" title={emp!.name}>{emp!.name.split(" ").map((n) => n[0]).join("")}</div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span>{project.tasks.length} tasks</span><span>•</span>
                                            <span>Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            <AddProjectModal
                isOpen={showAddProject}
                onClose={() => setShowAddProject(false)}
                onAdd={(project) => setProjectsList([project, ...projectsList])}
                preselectedClientIds={[id as string]}
            />

            {/* Add Subscription Modal */}
            <Modal isOpen={showAddSub} onClose={() => setShowAddSub(false)} className="max-w-lg mx-4">
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-6">Add Subscription</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Subscription Name</label>
                            <input type="text" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500" placeholder="e.g., Website Maintenance Retainer" />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Billing Type</label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {(["monthly", "hourly", "one-time", "milestone"] as const).map((type) => {
                                    const bt = billingTypeLabels[type];
                                    return (
                                        <button key={type} onClick={() => setNewSub({ ...newSub, billingType: type })} className={`rounded-lg border px-3 py-2.5 text-center text-xs font-medium transition-all ${newSub.billingType === type ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300 ring-2 ring-brand-500/20" : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
                                            <span className="block text-base mb-0.5">{bt.icon}</span>{bt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Billing-specific fields */}
                        {newSub.billingType === "monthly" && (
                            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Rate ($)</label><input type="number" value={newSub.monthlyRate} onChange={(e) => setNewSub({ ...newSub, monthlyRate: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" placeholder="3500" /></div>
                        )}
                        {newSub.billingType === "hourly" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Hourly Rate ($)</label><input type="number" value={newSub.hourlyRate} onChange={(e) => setNewSub({ ...newSub, hourlyRate: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" placeholder="150" /></div>
                                <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Est. Hours</label><input type="number" value={newSub.estimatedHours} onChange={(e) => setNewSub({ ...newSub, estimatedHours: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" placeholder="100" /></div>
                            </div>
                        )}
                        {(newSub.billingType === "one-time" || newSub.billingType === "milestone") && (
                            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount ($)</label><input type="number" value={newSub.fixedAmount} onChange={(e) => setNewSub({ ...newSub, fixedAmount: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" placeholder="50000" /></div>
                        )}
                        {newSub.billingType === "milestone" && (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Milestones</label>
                                <div className="flex gap-2">
                                    {[2, 3, 4].map((n) => (
                                        <button key={n} onClick={() => updateMilestoneLabels(n)} className={`h-10 w-10 rounded-lg border text-sm font-medium transition-all ${parseInt(newSub.milestoneCount) === n ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300" : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"}`}>{n}</button>
                                    ))}
                                </div>
                                <div className="mt-2 space-y-2">
                                    {newSub.milestoneLabels.slice(0, parseInt(newSub.milestoneCount) || 2).map((label, i) => (
                                        <input key={i} type="text" value={label} onChange={(e) => { const labels = [...newSub.milestoneLabels]; labels[i] = e.target.value; setNewSub({ ...newSub, milestoneLabels: labels }); }} className="h-9 w-full rounded-lg border border-gray-200 bg-transparent px-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" placeholder={`Milestone ${i + 1} label`} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label><input type="date" value={newSub.startDate} onChange={(e) => setNewSub({ ...newSub, startDate: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900" /></div>
                            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label><input type="date" value={newSub.endDate} onChange={(e) => setNewSub({ ...newSub, endDate: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900" /></div>
                        </div>

                        {clientProjects.length > 0 && (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Link to Project (optional)</label>
                                <select value={newSub.projectId} onChange={(e) => setNewSub({ ...newSub, projectId: e.target.value })} className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900">
                                    <option value="">None</option>
                                    {clientProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        )}

                        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label><textarea value={newSub.notes} onChange={(e) => setNewSub({ ...newSub, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" placeholder="Payment terms, conditions..." /></div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button onClick={() => setShowAddSub(false)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button onClick={handleAddSub} disabled={!newSub.name} className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Add Subscription</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
