"use client";

import React, { useState } from "react";
import { employees as initialEmployees, projects, Employee } from "@/data/mockData";
import { PlusIcon } from "@/icons/index";
import { Modal } from "@/components/ui/modal";

const statusColors: Record<string, { bg: string; dot: string; text: string }> = {
    available: {
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        dot: "bg-emerald-500",
        text: "text-emerald-700 dark:text-emerald-400",
    },
    busy: {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        dot: "bg-amber-500",
        text: "text-amber-700 dark:text-amber-400",
    },
    away: {
        bg: "bg-gray-100 dark:bg-gray-700",
        dot: "bg-gray-400",
        text: "text-gray-600 dark:text-gray-300",
    },
    offline: {
        bg: "bg-gray-100 dark:bg-gray-700",
        dot: "bg-gray-300 dark:bg-gray-600",
        text: "text-gray-500 dark:text-gray-400",
    },
};

const allTasks = projects.flatMap((p) => p.tasks);

export default function EmployeesPage() {
    const [employeesList, setEmployeesList] = useState<Employee[]>(initialEmployees);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDept, setFilterDept] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        role: "",
        department: "",
    });

    const departments = [
        "all",
        ...new Set(employeesList.map((e) => e.department)),
    ];

    const filteredEmployees = employeesList.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept =
            filterDept === "all" || emp.department === filterDept;
        return matchesSearch && matchesDept;
    });

    const handleAddEmployee = () => {
        const employee: Employee = {
            id: `emp-${Date.now()}`,
            ...newEmployee,
            avatar: "",
            status: "available",
            tasksAssigned: 0,
            tasksCompleted: 0,
        };
        setEmployeesList([employee, ...employeesList]);
        setNewEmployee({ name: "", email: "", role: "", department: "" });
        setShowAddModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                        Employees
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your team and track task assignments
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Employee
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
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {departments.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setFilterDept(dept)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filterDept === dept
                                    ? "bg-brand-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                }`}
                        >
                            {dept === "all"
                                ? "All"
                                : dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* Employee Cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredEmployees.map((emp) => {
                    const empTasks = allTasks.filter((t) => t.assigneeId === emp.id);
                    const activeTasks = empTasks.filter(
                        (t) => t.status !== "done"
                    ).length;
                    const completedTasks = empTasks.filter(
                        (t) => t.status === "done"
                    ).length;
                    const empProjects = [
                        ...new Set(empTasks.map((t) => t.projectId)),
                    ];
                    const statusStyle = statusColors[emp.status];

                    return (
                        <div
                            key={emp.id}
                            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-lg shadow-md">
                                                {emp.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div
                                                className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-gray-900 ${statusStyle.dot}`}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">
                                                {emp.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {emp.role}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                                        {emp.status}
                                    </span>
                                </div>

                                {/* Contact */}
                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        <span className="truncate">{emp.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                        </svg>
                                        <span>{emp.department}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white/90">
                                            {activeTasks}
                                        </p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Active
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
                                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                            {completedTasks}
                                        </p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Done
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
                                        <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                            {empProjects.length}
                                        </p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Projects
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Task List Preview */}
                            {empTasks.filter((t) => t.status !== "done").length > 0 && (
                                <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        Current Tasks
                                    </p>
                                    <div className="space-y-1.5">
                                        {empTasks
                                            .filter((t) => t.status !== "done")
                                            .slice(0, 3)
                                            .map((task) => (
                                                <div
                                                    key={task.id}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <div
                                                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${task.priority === "urgent"
                                                                ? "bg-red-500"
                                                                : task.priority === "high"
                                                                    ? "bg-amber-500"
                                                                    : task.priority === "medium"
                                                                        ? "bg-blue-500"
                                                                        : "bg-gray-400"
                                                            }`}
                                                    />
                                                    <span className="text-gray-700 dark:text-gray-300 truncate">
                                                        {task.title}
                                                    </span>
                                                </div>
                                            ))}
                                        {empTasks.filter((t) => t.status !== "done").length >
                                            3 && (
                                                <p className="text-xs text-gray-400 dark:text-gray-500 pl-3.5">
                                                    +
                                                    {empTasks.filter((t) => t.status !== "done").length -
                                                        3}{" "}
                                                    more
                                                </p>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Employee Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-md mx-4">
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-6">
                        Add New Employee
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={newEmployee.name}
                                onChange={(e) =>
                                    setNewEmployee({ ...newEmployee, name: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="Jane Smith"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={newEmployee.email}
                                onChange={(e) =>
                                    setNewEmployee({ ...newEmployee, email: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="jane@procms.com"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Role
                            </label>
                            <input
                                type="text"
                                value={newEmployee.role}
                                onChange={(e) =>
                                    setNewEmployee({ ...newEmployee, role: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="Full Stack Developer"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Department
                            </label>
                            <input
                                type="text"
                                value={newEmployee.department}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        department: e.target.value,
                                    })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="Engineering"
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
                            onClick={handleAddEmployee}
                            disabled={!newEmployee.name || !newEmployee.email || !newEmployee.role}
                            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Employee
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
