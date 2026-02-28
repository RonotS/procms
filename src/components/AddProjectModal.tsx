"use client";

import React, { useState } from "react";
import { clients, employees, defaultColumns, Project } from "@/data/mockData";
import { Modal } from "@/components/ui/modal";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (project: Project) => void;
    preselectedClientIds?: string[];
}

export function AddProjectModal({ isOpen, onClose, onAdd, preselectedClientIds = [] }: AddProjectModalProps) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        clientIds: preselectedClientIds,
        employeeIds: [] as string[],
        startDate: "",
        dueDate: "",
        budget: "",
        status: "active" as Project["status"],
    });

    // Reset form when modal opens with new preselected clients
    React.useEffect(() => {
        if (isOpen) {
            setForm((f) => ({ ...f, clientIds: preselectedClientIds }));
        }
    }, [isOpen, preselectedClientIds]);

    const toggleClient = (clientId: string) => {
        setForm((f) => ({
            ...f,
            clientIds: f.clientIds.includes(clientId)
                ? f.clientIds.filter((id) => id !== clientId)
                : [...f.clientIds, clientId],
        }));
    };

    const toggleEmployee = (empId: string) => {
        setForm((f) => ({
            ...f,
            employeeIds: f.employeeIds.includes(empId)
                ? f.employeeIds.filter((id) => id !== empId)
                : [...f.employeeIds, empId],
        }));
    };

    const handleSubmit = () => {
        const project: Project = {
            id: `proj-${Date.now()}`,
            name: form.name,
            description: form.description,
            clientIds: form.clientIds,
            status: form.status,
            progress: 0,
            startDate: form.startDate || new Date().toISOString().split("T")[0],
            dueDate: form.dueDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            budget: form.budget ? parseFloat(form.budget) : undefined,
            columns: [...defaultColumns],
            tasks: [],
        };
        onAdd(project);
        setForm({
            name: "",
            description: "",
            clientIds: preselectedClientIds,
            employeeIds: [],
            startDate: "",
            dueDate: "",
            budget: "",
            status: "active",
        });
        onClose();
    };

    const inputClass = "h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500";

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-4">
            <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
                        <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white/90">New Project</h2>
                </div>

                <div className="space-y-5">
                    {/* Name & Status */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g., Mobile App Redesign" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })} className={`${inputClass} dark:bg-gray-900`}>
                                <option value="active">Active</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" placeholder="Brief project description..." />
                    </div>

                    {/* Clients - Multi-select chips */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Clients <span className="text-xs font-normal text-gray-400">(select one or more)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {clients.map((client) => {
                                const selected = form.clientIds.includes(client.id);
                                return (
                                    <button
                                        key={client.id}
                                        type="button"
                                        onClick={() => toggleClient(client.id)}
                                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${selected
                                            ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300 ring-2 ring-brand-500/20"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${selected
                                            ? "bg-brand-500 text-white"
                                            : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                            }`}>
                                            {client.name.split(" ").map((n) => n[0]).join("")}
                                        </span>
                                        <span>{client.company}</span>
                                        {selected && (
                                            <svg className="h-4 w-4 text-brand-500 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team Members - Multi-select chips */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Team Members <span className="text-xs font-normal text-gray-400">(select employees)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {employees.map((emp) => {
                                const selected = form.employeeIds.includes(emp.id);
                                return (
                                    <button
                                        key={emp.id}
                                        type="button"
                                        onClick={() => toggleEmployee(emp.id)}
                                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${selected
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${selected
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                            }`}>
                                            {emp.name.split(" ").map((n) => n[0]).join("")}
                                        </span>
                                        <div className="text-left">
                                            <span className="block leading-tight">{emp.name}</span>
                                            <span className={`block text-[10px] leading-tight ${selected ? "text-emerald-500 dark:text-emerald-400" : "text-gray-400"}`}>{emp.role}</span>
                                        </div>
                                        {selected && (
                                            <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dates & Budget */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={`${inputClass} dark:bg-gray-900`} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className={`${inputClass} dark:bg-gray-900`} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Budget ($)</label>
                            <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputClass} placeholder="50000" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                        {form.clientIds.length > 0 && <span className="mr-3">{form.clientIds.length} client{form.clientIds.length > 1 ? "s" : ""}</span>}
                        {form.employeeIds.length > 0 && <span>{form.employeeIds.length} member{form.employeeIds.length > 1 ? "s" : ""}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!form.name || form.clientIds.length === 0}
                            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Create Project
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
