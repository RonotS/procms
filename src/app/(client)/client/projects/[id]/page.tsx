"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { projects as initialProjects, employees, taskComments as initialComments, Task, TaskComment, TaskCommentReply } from "@/data/mockData";
import TaskCommentModal from "@/components/TaskCommentModal";

const CURRENT_CLIENT_ID = "client-1";
const CURRENT_CLIENT_NAME = "James Mitchell";

export default function ClientProjectDetail() {
    const { id } = useParams();
    const project = initialProjects.find((p) => p.id === id);
    const [comments, setComments] = useState<TaskComment[]>(initialComments);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    if (!project) return <div className="p-8 text-center text-gray-500">Project not found</div>;

    const columns = project.columns;
    const tasks = project.tasks;

    const getCommentCount = (taskId: string) => comments.filter((c) => c.taskId === taskId).length;

    const handleAddComment = (comment: TaskComment) => setComments((prev) => [...prev, comment]);

    const handleAddReply = (commentId: string, reply: TaskCommentReply) => {
        setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c));
    };

    return (
        <div className="space-y-6">
            <Link href="/client/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                Back to Projects
            </Link>

            {/* Project header */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                        <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        {project.budget && <span>💰 ${project.budget.toLocaleString()}</span>}
                    </div>
                </div>
            </div>

            {/* Kanban with clickable tasks */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Board</h2>
                    <span className="text-xs text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400 px-2 py-0.5 rounded-full">Click tasks to comment</span>
                </div>
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-5 min-w-max">
                        {columns.sort((a, b) => a.order - b.order).map((col) => {
                            const colTasks = tasks.filter((t) => t.status === col.id);
                            return (
                                <div key={col.id} className="w-72 shrink-0">
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: col.color }} />
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{col.title}</h3>
                                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {colTasks.map((task) => {
                                            const assignee = employees.find((e) => e.id === task.assigneeId);
                                            const commentCount = getCommentCount(task.id);
                                            return (
                                                <div key={task.id} onClick={() => setSelectedTask(task)}
                                                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50 cursor-pointer transition-all hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700">
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {task.tags.map((tag) => (
                                                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">{tag}</span>
                                                        ))}
                                                    </div>
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h4>
                                                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {assignee && (
                                                                <>
                                                                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[9px] font-bold text-gray-500">{assignee.name.split(" ").map((n) => n[0]).join("")}</div>
                                                                    <span className="text-xs text-gray-500">{assignee.name.split(" ")[0]}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {commentCount > 0 && (
                                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">💬 {commentCount}</span>
                                                            )}
                                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${task.priority === "high" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : task.priority === "medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>{task.priority}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {colTasks.length === 0 && (
                                            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center text-xs text-gray-400">No tasks</div>
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
                    viewerType="client"
                    viewerId={CURRENT_CLIENT_ID}
                    viewerName={CURRENT_CLIENT_NAME}
                    onAddComment={handleAddComment}
                    onAddReply={handleAddReply}
                    onApprove={() => { }}
                    onReject={() => { }}
                />
            )}
        </div>
    );
}
