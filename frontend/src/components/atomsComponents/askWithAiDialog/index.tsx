"use client";

import { useCallback } from "react";
import { Sparkles, Terminal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/shadcnUI/dropdown-menu";
import { toast } from "sonner";

interface AskWithAiDropdownProps {
    children: React.ReactNode;
    content: string;
    title: string;
}

export function AskWithAiDropdown({
    children,
    content,
    title,
}: AskWithAiDropdownProps) {
    const handleAskAi = useCallback(
        async (baseUrl: string, platformName: string) => {
            const link = window.location.href;
            
            // We want to pass this via the URL ?q= parameter, but URLs have a max length
            // limit (usually ~2000 to ~8000 chars before servers reject them).
            // We will safely truncate the markdown content if it gets too large so it safely pre-fills.
            const SAFE_MAX_PROMPT_LENGTH = 3500;
            const prefix = `I'm reading an article titled "${title}" at ${link}\n\nHere is the content in markdown:\n\n---\n`;
            const suffix = `\n---\n\n`;
            
            let safeContent = content;
            const projectedLength = prefix.length + content.length + suffix.length;
            
            if (projectedLength > SAFE_MAX_PROMPT_LENGTH) {
                const allowedContentLen = SAFE_MAX_PROMPT_LENGTH - prefix.length - suffix.length - 100; // 100 char buffer
                safeContent = content.substring(0, allowedContentLen) + "\n\n...[Content truncated for length]...";
            }

            const prompt = prefix + safeContent + suffix;
            
            // Build the ?q= URL
            const urlWithPrompt = new URL(baseUrl);
            urlWithPrompt.searchParams.set("q", prompt);

            try {
                // Also copy the *full* untruncated content to clipboard just in case they need it all
                const fullPrompt = prefix + content + suffix;
                await navigator.clipboard.writeText(fullPrompt);
                
                toast.success(
                    `Opening ${platformName}. Full content also copied to clipboard!`,
                    { duration: 4000 }
                );
                
                setTimeout(() => {
                    window.open(urlWithPrompt.toString(), "_blank");
                }, 800);
            } catch {
                toast.error(`Opening ${platformName}...`);
                window.open(urlWithPrompt.toString(), "_blank");
            }
        },
        [content, title]
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                <DropdownMenuLabel className="flex items-center gap-2 pb-2">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    <span>Ask AI about this article</span>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />

                <DropdownMenuItem 
                    className="gap-2 cursor-pointer py-2 rounded-lg"
                    onClick={() => handleAskAi("https://v0.dev/chat", "v0")}
                >
                    <Terminal className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-medium">Open in v0</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                    className="gap-2 cursor-pointer py-2 rounded-lg"
                    onClick={() => handleAskAi("https://claude.ai/new", "Claude")}
                >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">Open in Claude</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                    className="gap-2 cursor-pointer py-2 rounded-lg"
                    onClick={() => handleAskAi("https://chatgpt.com/", "ChatGPT")}
                >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">Open in ChatGPT</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                    className="gap-2 cursor-pointer py-2 rounded-lg"
                    onClick={() => handleAskAi("https://gemini.google.com/app", "Gemini")}
                >
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Open in Gemini</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                    className="gap-2 cursor-pointer py-2 rounded-lg"
                    onClick={() => handleAskAi("https://www.perplexity.ai/search", "Perplexity")}
                >
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium">Open in Perplexity</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
