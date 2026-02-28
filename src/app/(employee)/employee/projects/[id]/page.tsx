"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { projects as initialProjects, employees, taskComments as initialComments, Task, TaskComment, TaskCommentReply } from "@/data/mockData";
import TaskCommentModal from "@/components/TaskCommentModal";

const CURRENT_EMP_ID = "emp-1";
const CURRENT_EMP_NAME = "Alex Rivera";

export default function EmployeeProjectDetail() {
    const { id } = useParams();
    const project = initialProjects.find((p) => p.id === id);

    const [tasks, setTasks] = useState<Task[]>(project?.tasks || []);
    const [comments, setComments] = useState<TaskComment[]>(initialComments);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    if (!project) return <div className="p-8 text-center text-gray-500">Project not found</div>;

    const columns = project.columns;

    const handleDragStart = (taskId: string) => setDraggedTask(taskId);
    const handleDrop = (columnId: string) => {
        if (!draggedTask) return;
        setTasks((prev) => prev.map((t) => t.id === draggedTask ? { ...t, status: columnId } : t));
        setDraggedTask(null);
    };

    const getCommentCount = (taskId: string) => comments.filter((c) => c.taskId === taskId).length;
    const getPendingCount = (taskId: string) => comments.filter((c) => c.taskId === taskId && c.status === "pending").length;

    const handleAddComment = (comment: TaskComment) => setComments((prev) => [...prev, comment]);
    const handleAddReply = (commentId: string, reply: TaskCommentReply) => {
        setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c));
    };

    const handleApprove = (commentId: string) => {
        const comment = comments.find((c) => c.id === commentId);
        if (!comment) return;
        // Create a new task from the approved comment
        const newTask: Task = {
            id: `task-generated-${Date.now()}`,
            title: `[Client Request] ${comment.content.slice(0, 60)}...`,
            description: comment.content,
            status: "todo",
            priority: "medium",
            assigneeId: CURRENT_EMP_ID,
            projectId: project.id,
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

    return (
        <div className="space-y-6">
            <Link href="/employee/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-violet-600 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                Back to Projects
            </Link>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                <p className="mt-1 text-sm text-gray-500">{project.description}</p>
            </div>

            {/* Interactive Kanban */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Board</h2>
                    <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full dark:bg-violet-500/10 dark:text-violet-400">Drag to move • Click for comments</span>
                </div>
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-5 min-w-max">
                        {columns.sort((a, b) => a.order - b.order).map((col) => {
                            const colTasks = tasks.filter((t) => t.status === col.id);
                            return (
                                <div key={col.id} className="w-72 shrink-0"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(col.id)}>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: col.color }} />
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{col.title}</h3>
                                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                                    </div>
                                    <div className="space-y-3 min-h-[100px] rounded-xl border-2 border-dashed border-transparent p-1 transition-colors" style={{ borderColor: draggedTask ? `${col.color}40` : "transparent" }}>
                                        {colTasks.map((task) => {
                                            const assignee = employees.find((e) => e.id === task.assigneeId);
                                            const commentCount = getCommentCount(task.id);
                                            const pendingCount = getPendingCount(task.id);
                                            return (
                                                <div key={task.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(task.id)}
                                                    onClick={() => setSelectedTask(task)}
                                                    className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 ${draggedTask === task.id ? "opacity-50 scale-95" : ""}`}>
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {task.tags.map((tag) => (
                                                            <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tag === "client-request" ? "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300" : "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"}`}>{tag}</span>
                                                        ))}
                                                    </div>
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h4>
                                                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {assignee && (
                                                                <>
                                                                    <div className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-[9px] font-bold text-violet-600 dark:text-violet-300">{assignee.name.split(" ").map((n) => n[0]).join("")}</div>
                                                                    <span className="text-xs text-gray-500">{assignee.name.split(" ")[0]}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            {pendingCount > 0 && (
                                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300 animate-pulse">⏳ {pendingCount}</span>
                                                            )}
                                                            {commentCount > 0 && (
                                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">💬 {commentCount}</span>
                                                            )}
                                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${task.priority === "high" || task.priority === "urgent" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : task.priority === "medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>{task.priority}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {colTasks.length === 0 && (
                                            <div className={`rounded-xl border border-dashed p-6 text-center text-xs transition-colors ${draggedTask ? "border-violet-300 bg-violet-50/50 text-violet-400 dark:border-violet-700 dark:bg-violet-500/5" : "border-gray-200 dark:border-gray-700 text-gray-400"}`}>
                                                {draggedTask ? "Drop here" : "No tasks"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Comment Modal */}
            {selectedTask && (
                <TaskCommentModal
                    task={selectedTask}
                    projectId={project.id}
                    comments={comments}
                    onClose={() => setSelectedTask(null)}
                    viewerType="employee"
                    viewerId={CURRENT_EMP_ID}
                    viewerName={CURRENT_EMP_NAME}
                    onAddComment={handleAddComment}
                    onAddReply={handleAddReply}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}
