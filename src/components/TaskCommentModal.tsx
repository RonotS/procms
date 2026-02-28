"use client";

import React, { useState, useRef } from "react";
import { Task, TaskComment, TaskCommentReply, employees, clients } from "@/data/mockData";

interface TaskCommentModalProps {
    task: Task;
    projectId: string;
    comments: TaskComment[];
    onClose: () => void;
    viewerType: "client" | "employee" | "admin";
    viewerId: string;
    viewerName: string;
    onAddComment: (comment: TaskComment) => void;
    onAddReply: (commentId: string, reply: TaskCommentReply) => void;
    onApprove: (commentId: string) => void;
    onReject: (commentId: string, reason: string) => void;
}

const statusBadge: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const authorColors: Record<string, string> = {
    client: "bg-teal-500",
    employee: "bg-violet-500",
    admin: "bg-blue-500",
};

export default function TaskCommentModal({
    task,
    projectId,
    comments,
    onClose,
    viewerType,
    viewerId,
    viewerName,
    onAddComment,
    onAddReply,
    onApprove,
    onReject,
}: TaskCommentModalProps) {
    const [newComment, setNewComment] = useState("");
    const [newImages, setNewImages] = useState<string[]>([]);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const taskComments = comments.filter((c) => c.taskId === task.id);
    const assignee = employees.find((e) => e.id === task.assigneeId);
    const canModerate = viewerType === "admin" || viewerType === "employee";

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setNewImages((prev) => [...prev, ev.target!.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmitComment = () => {
        if (!newComment.trim() && newImages.length === 0) return;
        const comment: TaskComment = {
            id: `comment-${Date.now()}`,
            taskId: task.id,
            projectId,
            authorId: viewerId,
            authorType: viewerType,
            authorName: viewerName,
            content: newComment.trim(),
            images: newImages,
            createdAt: new Date().toISOString(),
            status: "pending",
            replies: [],
        };
        onAddComment(comment);
        setNewComment("");
        setNewImages([]);
    };

    const handleSubmitReply = (commentId: string) => {
        if (!replyText.trim()) return;
        const reply: TaskCommentReply = {
            id: `reply-${Date.now()}`,
            authorId: viewerId,
            authorType: viewerType,
            authorName: viewerName,
            content: replyText.trim(),
            createdAt: new Date().toISOString(),
        };
        onAddReply(commentId, reply);
        setReplyText("");
        setReplyingTo(null);
    };

    const handleReject = (commentId: string) => {
        if (!rejectReason.trim()) return;
        onReject(commentId, rejectReason.trim());
        setRejectReason("");
        setRejectingId(null);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-8 pb-8">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                {/* Header */}
                <div className="sticky top-0 z-20 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900 rounded-t-2xl">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${task.priority === "high" || task.priority === "urgent" ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" : task.priority === "medium" ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>{task.priority}</span>
                            {task.tags.map((tag) => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">{tag}</span>
                            ))}
                        </div>
                        <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{task.title}</h2>
                        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                        {assignee && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-[9px] font-bold text-violet-600 dark:text-violet-300">{assignee.name.split(" ").map((n) => n[0]).join("")}</div>
                                <span className="text-xs text-gray-500">{assignee.name}</span>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Comments Section */}
                <div className="px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        Comments <span className="text-gray-400 font-normal">({taskComments.length})</span>
                    </h3>

                    {taskComments.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
                            <p className="text-sm text-gray-400">No comments yet</p>
                            <p className="text-xs text-gray-300 mt-1">Be the first to comment on this task</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {taskComments.map((comment) => (
                            <div key={comment.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Comment header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-7 w-7 rounded-full ${authorColors[comment.authorType]} flex items-center justify-center text-white text-[10px] font-bold`}>
                                            {comment.authorName.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.authorName}</span>
                                            <span className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 capitalize">{comment.authorType}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge[comment.status]}`}>{comment.status}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                                    </div>
                                </div>

                                {/* Comment body */}
                                <div className="px-4 py-3">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                                    {comment.images.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {comment.images.map((img, i) => (
                                                <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity">
                                                    <img src={img} alt={`Attachment ${i + 1}`} className="h-32 w-auto object-cover" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {comment.status === "rejected" && comment.rejectionReason && (
                                        <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 px-3 py-2">
                                            <p className="text-xs font-medium text-red-600 dark:text-red-400">Rejection Reason:</p>
                                            <p className="text-xs text-red-500 dark:text-red-300 mt-0.5">{comment.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Replies */}
                                {comment.replies.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="flex gap-3 px-4 py-3 ml-4 border-l-2 border-gray-200 dark:border-gray-700">
                                                <div className={`h-6 w-6 shrink-0 rounded-full ${authorColors[reply.authorType]} flex items-center justify-center text-white text-[8px] font-bold`}>
                                                    {reply.authorName.split(" ").map((n) => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-900 dark:text-white">{reply.authorName}</span>
                                                        <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                                                    </div>
                                                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions bar */}
                                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/30">
                                    <button onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyText(""); }}
                                        className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/10">
                                        💬 Reply
                                    </button>
                                    {canModerate && comment.status === "pending" && (
                                        <>
                                            <button onClick={() => onApprove(comment.id)}
                                                className="text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-md transition-colors">
                                                ✅ Approve & Create Task
                                            </button>
                                            <button onClick={() => { setRejectingId(rejectingId === comment.id ? null : comment.id); setRejectReason(""); }}
                                                className="text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors">
                                                ❌ Reject
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Reply form */}
                                {replyingTo === comment.id && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-blue-50/30 dark:bg-blue-500/5">
                                        <div className="flex gap-2">
                                            <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..."
                                                onKeyDown={(e) => e.key === "Enter" && handleSubmitReply(comment.id)}
                                                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <button onClick={() => handleSubmitReply(comment.id)}
                                                className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 transition-colors">Send</button>
                                        </div>
                                    </div>
                                )}

                                {/* Reject form */}
                                {rejectingId === comment.id && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-red-50/30 dark:bg-red-500/5">
                                        <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">Provide a reason for rejection:</p>
                                        <div className="flex gap-2">
                                            <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rejection reason..."
                                                onKeyDown={(e) => e.key === "Enter" && handleReject(comment.id)}
                                                className="flex-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm dark:border-red-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" />
                                            <button onClick={() => handleReject(comment.id)}
                                                className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors">Reject</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Comment Form */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900 rounded-b-2xl">
                    <div className="flex items-start gap-3">
                        <div className={`h-8 w-8 shrink-0 rounded-full ${authorColors[viewerType]} flex items-center justify-center text-white text-[10px] font-bold`}>
                            {viewerName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1 space-y-2">
                            <textarea
                                value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                placeholder={viewerType === "client" ? "Add a comment or request to this task..." : "Reply to this task..."}
                                rows={3}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            {/* Image previews */}
                            {newImages.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {newImages.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img src={img} alt="upload" className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                                            <button onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                    <button onClick={() => fileInputRef.current?.click()}
                                        className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                        🖼️ Attach Images
                                    </button>
                                </div>
                                <button onClick={handleSubmitComment} disabled={!newComment.trim() && newImages.length === 0}
                                    className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    Send Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
