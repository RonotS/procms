"use client";

import React, { useState } from "react";
import Link from "next/link";
import { clients as initialClients, projects, Client } from "@/data/mockData";
import { PlusIcon, GroupIcon, ArrowRightIcon } from "@/icons/index";
import { Modal } from "@/components/ui/modal";

export default function ClientsPage() {
    const [clientsList, setClientsList] = useState<Client[]>(initialClients);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newClient, setNewClient] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        industry: "",
        address: "",
    });

    const filteredClients = clientsList.filter((client) => {
        const matchesSearch =
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || client.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleAddClient = () => {
        const client: Client = {
            id: `client-${Date.now()}`,
            ...newClient,
            avatar: "",
            status: "active",
            createdAt: new Date().toISOString().split("T")[0],
            totalProjects: 0,
            totalRevenue: 0,
        };
        setClientsList([client, ...clientsList]);
        setNewClient({
            name: "",
            company: "",
            email: "",
            phone: "",
            industry: "",
            address: "",
        });
        setShowAddModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                        Clients
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your client relationships and projects
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Client
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
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {(["all", "active", "inactive"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterStatus === status
                                ? "bg-brand-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Client Cards Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredClients.map((client) => {
                    const clientProjects = projects.filter(
                        (p) => p.clientIds.includes(client.id)
                    );
                    const activeProjects = clientProjects.filter(
                        (p) => p.status === "active"
                    ).length;

                    return (
                        <Link
                            key={client.id}
                            href={`/clients/${client.id}`}
                            className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-brand-200 dark:hover:border-brand-800"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-lg shadow-md">
                                        {client.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                            {client.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {client.company}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${client.status === "active"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {client.status}
                                </span>
                            </div>

                            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                {client.email}
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                {client.phone}
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white/90">
                                            {clientProjects.length}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Projects
                                        </p>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                            {activeProjects}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Active
                                        </p>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white/90">
                                            ${(client.totalRevenue / 1000).toFixed(0)}k
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Revenue
                                        </p>
                                    </div>
                                </div>
                                <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-brand-500 transition-colors" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Add Client Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-lg mx-4">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
                            <GroupIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white/90">
                            Add New Client
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={newClient.name}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, name: e.target.value })
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    value={newClient.company}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, company: e.target.value })
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                    placeholder="Acme Inc"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, email: e.target.value })
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                    placeholder="john@acme.com"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={newClient.phone}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, phone: e.target.value })
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Industry
                            </label>
                            <input
                                type="text"
                                value={newClient.industry}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, industry: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="Technology"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Address
                            </label>
                            <input
                                type="text"
                                value={newClient.address}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, address: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="123 Main St, City, State"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddClient}
                            disabled={!newClient.name || !newClient.company || !newClient.email}
                            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Client
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
