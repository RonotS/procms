"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    projects as initialProjects,
    clients,
    employees,
    defaultColumns,
    Task,
    KanbanColumn,
    taskComments as initialComments,
    TaskComment,
    TaskCommentReply,
} from "@/data/mockData";
import {
    PlusIcon,
    TrashBinIcon,
    ChevronLeftIcon,
    PencilIcon,
} from "@/icons/index";
import { Modal } from "@/components/ui/modal";
import TaskCommentModal from "@/components/TaskCommentModal";

const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    high: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    urgent: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const priorityDots: Record<string, string> = {
    low: "bg-gray-400",
    medium: "bg-blue-500",
    high: "bg-amber-500",
    urgent: "bg-red-500",
};

const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function ProjectDetailPage() {
    const { id } = useParams();
    const projectData = initialProjects.find((p) => p.id === id);
    const projectClients = projectData?.clientIds.map((cid) => clients.find((c) => c.id === cid)).filter(Boolean) || [];

    const [columns, setColumns] = useState<KanbanColumn[]>(
        projectData?.columns || defaultColumns
    );
    const [tasks, setTasks] = useState<Task[]>(projectData?.tasks || []);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddColumn, setShowAddColumn] = useState(false);
    const [activeColumn, setActiveColumn] = useState<string>("");
    const [showTaskDetail, setShowTaskDetail] = useState<Task | null>(null);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [comments, setComments] = useState<TaskComment[]>(initialComments);
    const [commentTask, setCommentTask] = useState<Task | null>(null);

    const getCommentCount = (taskId: string) => comments.filter((c) => c.taskId === taskId).length;
    const getPendingCount = (taskId: string) => comments.filter((c) => c.taskId === taskId && c.status === "pending").length;

    const handleAddComment = (comment: TaskComment) => setComments((prev) => [...prev, comment]);
    const handleAddReply = (commentId: string, reply: TaskCommentReply) => {
        setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c));
    };
    const handleApprove = (commentId: string) => {
        const comment = comments.find((c) => c.id === commentId);
        if (!comment) return;
        const newTask: Task = {
            id: `task-generated-${Date.now()}`,
            title: `[Client Request] ${comment.content.slice(0, 60)}...`,
            description: comment.content,
            status: "todo",
            priority: "medium",
            assigneeId: employees[0]?.id || "",
            projectId: projectData!.id,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            createdAt: new Date().toISOString().split("T")[0],
            tags: ["client-request"],
        };
        setTasks((prev) => [...prev, newTask]);
        setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, status: "approved" } : c));
    };
    const handleReject = (commentId: string, reason: string) => {
        setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, status: "rejected", rejectionReason: reason } : c));
    };

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "medium" as Task["priority"],
        assigneeId: "",
        dueDate: "",
        tags: "",
    });

    const [newColumn, setNewColumn] = useState({
        title: "",
        color: "#3B82F6",
    });

    if (!projectData) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white/90">
                    Project Not Found
                </h2>
                <Link href="/projects" className="mt-4 text-brand-500 hover:text-brand-600">
                    ← Back to Projects
                </Link>
            </div>
        );
    }

    const handleAddTask = () => {
        const task: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
            status: activeColumn,
            priority: newTask.priority,
            assigneeId: newTask.assigneeId,
            projectId: projectData.id,
            dueDate: newTask.dueDate,
            createdAt: new Date().toISOString().split("T")[0],
            tags: newTask.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        };
        setTasks([...tasks, task]);
        setNewTask({
            title: "",
            description: "",
            priority: "medium",
            assigneeId: "",
            dueDate: "",
            tags: "",
        });
        setShowAddTask(false);
    };

    const handleAddColumn = () => {
        const column: KanbanColumn = {
            id: `col-${Date.now()}`,
            title: newColumn.title,
            color: newColumn.color,
            order: columns.length,
        };
        setColumns([...columns, column]);
        setNewColumn({ title: "", color: "#3B82F6" });
        setShowAddColumn(false);
    };

    const handleDeleteColumn = (columnId: string) => {
        setColumns(columns.filter((c) => c.id !== columnId));
        // Move tasks from deleted column to backlog
        setTasks(
            tasks.map((t) =>
                t.status === columnId
                    ? { ...t, status: columns[0]?.id || "backlog" }
                    : t
            )
        );
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter((t) => t.id !== taskId));
        setShowTaskDetail(null);
    };

    const handleDragStart = (taskId: string) => {
        setDraggedTask(taskId);
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (columnId: string) => {
        if (draggedTask) {
            setTasks(
                tasks.map((t) =>
                    t.id === draggedTask ? { ...t, status: columnId } : t
                )
            );
        }
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const colorPresets = [
        "#6B7280",
        "#EF4444",
        "#F59E0B",
        "#10B981",
        "#3B82F6",
        "#8B5CF6",
        "#EC4899",
        "#06B6D4",
        "#F97316",
        "#14B8A6",
    ];

    return (
        <div className="space-y-6 overflow-hidden">
            {/* Back Button */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
                <ChevronLeftIcon className="h-4 w-4" />
                Back to Projects
            </Link>

            {/* Project Header */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white/90 truncate">
                                {projectData.name}
                            </h1>
                            <span
                                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[projectData.status]
                                    }`}
                            >
                                {projectData.status}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {projectData.description}
                        </p>
                        {projectClients.length > 0 && (
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <svg className="h-4 w-4 shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                {projectClients.map((c, i) => (
                                    <span key={c!.id} className="inline-flex items-center">
                                        <Link href={`/clients/${c!.id}`} className="text-sm text-brand-500 hover:text-brand-600 transition-colors">
                                            {c!.company}
                                        </Link>
                                        {i < projectClients.length - 1 && <span className="ml-2 mr-1 text-gray-300 dark:text-gray-600">,</span>}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap shrink-0">
                        <button
                            onClick={() => setShowAddColumn(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add Column
                        </button>
                        <button
                            onClick={() => {
                                setActiveColumn(columns[1]?.id || columns[0]?.id || "");
                                setShowAddTask(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition-colors"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Project Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 border-t border-gray-100 pt-5 dark:border-gray-800 sm:grid-cols-4">
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                        <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                                    style={{ width: `${projectData.progress}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white/90 shrink-0">
                                {projectData.progress}%
                            </span>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</p>
                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white/90">
                            {tasks.length}
                        </p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white/90 truncate">
                            {projectData.budget ? `$${projectData.budget.toLocaleString()}` : "—"}
                        </p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white/90 truncate">
                            {new Date(projectData.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-5 min-w-max">
                    {columns
                        .sort((a, b) => a.order - b.order)
                        .map((column) => {
                            const columnTasks = tasks.filter(
                                (t) => t.status === column.id
                            );

                            return (
                                <div
                                    key={column.id}
                                    className={`w-[320px] shrink-0 rounded-2xl border transition-all duration-200 ${dragOverColumn === column.id
                                        ? "border-brand-400 bg-brand-50/50 dark:border-brand-600 dark:bg-brand-500/5"
                                        : "border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.01]"
                                        }`}
                                    onDragOver={(e) => handleDragOver(e, column.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={() => handleDrop(column.id)}
                                >
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: column.color }}
                                            />
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90">
                                                {column.title}
                                            </h3>
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                {columnTasks.length}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    setActiveColumn(column.id);
                                                    setShowAddTask(true);
                                                }}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                                                title="Add task to column"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </button>
                                            {columns.length > 1 && (
                                                <button
                                                    onClick={() => handleDeleteColumn(column.id)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                                                    title="Delete column"
                                                >
                                                    <TrashBinIcon className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Task Cards */}
                                    <div className="space-y-3 px-3 pb-3 min-h-[100px]">
                                        {columnTasks.map((task) => {
                                            const assignee = employees.find(
                                                (e) => e.id === task.assigneeId
                                            );

                                            return (
                                                <div
                                                    key={task.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(task.id)}
                                                    onClick={() => setShowTaskDetail(task)}
                                                    className={`cursor-grab active:cursor-grabbing rounded-xl border bg-white p-4 dark:bg-gray-900 transition-all duration-200 hover:shadow-md ${draggedTask === task.id
                                                        ? "opacity-50 border-brand-400 dark:border-brand-600"
                                                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                                                        }`}
                                                >
                                                    {/* Tags */}
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

                                                    {/* Task Title */}
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white/90 line-clamp-2">
                                                        {task.title}
                                                    </h4>

                                                    {/* Footer */}
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`h-2 w-2 rounded-full ${priorityDots[task.priority]}`}
                                                            />
                                                            <span className="text-[11px] text-gray-400 dark:text-gray-500 capitalize">
                                                                {task.priority}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            {getPendingCount(task.id) > 0 && (
                                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300 animate-pulse">⏳ {getPendingCount(task.id)}</span>
                                                            )}
                                                            {getCommentCount(task.id) > 0 && (
                                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">💬 {getCommentCount(task.id)}</span>
                                                            )}
                                                            {task.dueDate && (
                                                                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                                                    {new Date(task.dueDate).toLocaleDateString(
                                                                        "en-US",
                                                                        { month: "short", day: "numeric" }
                                                                    )}
                                                                </span>
                                                            )}
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
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Add Task Modal */}
            <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} className="max-w-lg mx-4">
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-6">
                        Add New Task
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title
                            </label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, title: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="Task title..."
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, description: e.target.value })
                                }
                                rows={3}
                                className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="Task description..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Column
                                </label>
                                <select
                                    value={activeColumn}
                                    onChange={(e) => setActiveColumn(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900"
                                >
                                    {columns.map((col) => (
                                        <option key={col.id} value={col.id}>
                                            {col.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Priority
                                </label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            priority: e.target.value as Task["priority"],
                                        })
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Assignee
                                </label>
                                <select
                                    value={newTask.assigneeId}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, assigneeId: e.target.value })
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900"
                                >
                                    <option value="">Unassigned</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name} - {emp.role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, dueDate: e.target.value })
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-900"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={newTask.tags}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, tags: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="frontend, design, api"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            onClick={() => setShowAddTask(false)}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddTask}
                            disabled={!newTask.title}
                            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add Column Modal */}
            <Modal isOpen={showAddColumn} onClose={() => setShowAddColumn(false)} className="max-w-md mx-4">
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-6">
                        Add New Column
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Column Name
                            </label>
                            <input
                                type="text"
                                value={newColumn.title}
                                onChange={(e) =>
                                    setNewColumn({ ...newColumn, title: e.target.value })
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
                                placeholder="e.g., QA Testing"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Color
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {colorPresets.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setNewColumn({ ...newColumn, color })}
                                        className={`h-8 w-8 rounded-lg transition-all ${newColumn.color === color
                                            ? "ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-gray-900 scale-110"
                                            : "hover:scale-105"
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            onClick={() => setShowAddColumn(false)}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddColumn}
                            disabled={!newColumn.title}
                            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Column
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Task Detail Modal */}
            <Modal
                isOpen={showTaskDetail !== null}
                onClose={() => setShowTaskDetail(null)}
                className="max-w-lg mx-4"
            >
                {showTaskDetail && (
                    <div className="p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    {showTaskDetail.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white/90">
                                    {showTaskDetail.title}
                                </h2>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                            {showTaskDetail.description}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Status
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white/90 capitalize">
                                    {columns.find((c) => c.id === showTaskDetail.status)?.title ||
                                        showTaskDetail.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Priority
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[showTaskDetail.priority]
                                        }`}
                                >
                                    {showTaskDetail.priority}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Assignee
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                                    {employees.find((e) => e.id === showTaskDetail.assigneeId)
                                        ?.name || "Unassigned"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Due Date
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                                    {showTaskDetail.dueDate
                                        ? new Date(showTaskDetail.dueDate).toLocaleDateString(
                                            "en-US",
                                            { month: "short", day: "numeric", year: "numeric" }
                                        )
                                        : "No due date"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Created
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                                    {new Date(showTaskDetail.createdAt).toLocaleDateString(
                                        "en-US",
                                        { month: "short", day: "numeric", year: "numeric" }
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => handleDeleteTask(showTaskDetail.id)}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <TrashBinIcon className="h-4 w-4" />
                                Delete Task
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setCommentTask(showTaskDetail); setShowTaskDetail(null); }}
                                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-colors"
                                >
                                    💬 Comments
                                    {getCommentCount(showTaskDetail.id) > 0 && (
                                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 text-xs px-1.5 py-0.5 rounded-full">{getCommentCount(showTaskDetail.id)}</span>
                                    )}
                                    {getPendingCount(showTaskDetail.id) > 0 && (
                                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 text-xs px-1.5 py-0.5 rounded-full animate-pulse">{getPendingCount(showTaskDetail.id)} pending</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowTaskDetail(null)}
                                    className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Task Comment Modal */}
            {commentTask && (
                <TaskCommentModal
                    task={commentTask}
                    projectId={projectData.id}
                    comments={comments}
                    onClose={() => setCommentTask(null)}
                    viewerType="admin"
                    viewerId="admin-1"
                    viewerName="Admin"
                    onAddComment={handleAddComment}
                    onAddReply={handleAddReply}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}
