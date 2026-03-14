"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Terminal } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/shadcnUI/dialog";
import { Button } from "@/components/shadcnUI/button";
import { toast } from "sonner";

interface AskWithAiDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content: string;
    title: string;
}

export function AskWithAiDialog({
    open,
    onOpenChange,
    content,
    title,
}: AskWithAiDialogProps) {
    const [llmQuestion, setLlmQuestion] = useState("");
    const [llmPromptCopied, setLlmPromptCopied] = useState(false);

    const generatedPrompt = useMemo(() => {
        if (!content) return "";
        return `I'm reading a post titled "${title}". Here is the content:\n\n---\n${content}\n---\n\nMy question: ${llmQuestion}`;
    }, [content, title, llmQuestion]);

    const handleCopyLlmPrompt = useCallback(async () => {
        if (!llmQuestion.trim()) {
            toast.error("Please enter a question first");
            return;
        }
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            setLlmPromptCopied(true);
            toast.success("Prompt copied! Paste it into your favorite LLM.");
            setTimeout(() => setLlmPromptCopied(false), 2000);
        } catch {
            toast.error("Failed to copy prompt");
        }
    }, [generatedPrompt, llmQuestion]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-[95vw] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
                <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/30 flex-shrink-0 bg-gradient-to-r from-violet-500/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/15 flex items-center justify-center shadow-sm shadow-violet-500/10">
                            <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-base font-bold">
                                Ask AI about this article
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground/60 mt-0.5">
                                Ask questions about this page
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex flex-col gap-2 p-8">

                    <Button
                        variant="outline"
                        className="gap-1.5 rounded-xl"
                        onClick={() => window.open(window.location.href, "_blank")}
                    >
                        <Terminal className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-semibold">Open in v0</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="gap-1.5 rounded-xl"
                        onClick={() => window.open(window.location.href, "_blank")}
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold">Open in Claude</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="gap-1.5 rounded-xl"
                        onClick={() => window.open(window.location.href, "_blank")}
                    >
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-semibold">Open in ChatGPT</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
