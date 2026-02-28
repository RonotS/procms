"use client";

import React, { useState, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { projects, eodReports as initialReports, EODReport } from "@/data/mockData";

const CURRENT_EMP_ID = "emp-1";

function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    const addImage = useCallback(() => {
        const url = window.prompt("Enter image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    const btnClass = (active: boolean) =>
        `px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${active ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`;

    return (
        <div className="flex flex-wrap gap-1 border-b border-gray-200 px-3 py-2 dark:border-gray-700">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>
                <strong>B</strong>
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))}>
                <em>I</em>
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))}>
                <s>S</s>
            </button>
            <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))}>
                H3
            </button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>
                • List
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))}>
                1. List
            </button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))}>
                &ldquo; Quote
            </button>
            <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
            <button onClick={addImage} className={btnClass(false)}>
                🖼️ Image
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)}>
                ― HR
            </button>
            <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} disabled={!editor.can().undo()}>
                ↩ Undo
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} disabled={!editor.can().redo()}>
                ↪ Redo
            </button>
        </div>
    );
}

export default function EODReportsPage() {
    const assignedProjects = projects.filter((p) => p.tasks.some((t) => t.assigneeId === CURRENT_EMP_ID));
    const [reports, setReports] = useState<EODReport[]>(initialReports.filter((r) => r.employeeId === CURRENT_EMP_ID));
    const [selectedProject, setSelectedProject] = useState(assignedProjects[0]?.id || "");
    const [showEditor, setShowEditor] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({ placeholder: "Write your end-of-day report here... What did you work on? Any blockers?" }),
        ],
        content: "",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none px-4 py-3 min-h-[200px] focus:outline-none",
            },
        },
    });

    const handleSubmit = () => {
        if (!editor || !selectedProject) return;
        const html = editor.getHTML();
        if (html === "<p></p>") return;
        const report: EODReport = {
            id: `report-${Date.now()}`,
            employeeId: CURRENT_EMP_ID,
            projectId: selectedProject,
            date: new Date().toISOString().split("T")[0],
            content: html,
            createdAt: new Date().toISOString(),
        };
        setReports([report, ...reports]);
        editor.commands.clearContent();
        setShowEditor(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EOD Reports</h1>
                    <p className="mt-1 text-sm text-gray-500">Submit daily progress reports for your projects</p>
                </div>
                <button onClick={() => setShowEditor(!showEditor)}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-600 transition-colors">
                    {showEditor ? "Cancel" : "✏️ Write Report"}
                </button>
            </div>

            {/* WYSIWYG Editor */}
            {showEditor && (
                <div className="rounded-2xl border border-violet-200 bg-white dark:border-violet-800 dark:bg-white/[0.03] overflow-hidden">
                    <div className="flex items-center gap-4 border-b border-gray-200 px-4 py-3 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project:</label>
                        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                            {assignedProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <span className="text-xs text-gray-400 ml-auto">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <Toolbar editor={editor} />
                    <EditorContent editor={editor} />
                    <div className="flex justify-end border-t border-gray-200 px-4 py-3 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button onClick={handleSubmit}
                            className="rounded-lg bg-violet-500 px-5 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors">
                            Submit Report
                        </button>
                    </div>
                </div>
            )}

            {/* Reports list */}
            <div className="space-y-4">
                {reports.map((report) => {
                    const project = projects.find((p) => p.id === report.projectId);
                    return (
                        <div key={report.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 text-sm">📝</div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{project?.name}</h3>
                                        <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full dark:bg-emerald-500/10 dark:text-emerald-400">Submitted</span>
                            </div>
                            <div className="px-6 py-4 prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: report.content }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
