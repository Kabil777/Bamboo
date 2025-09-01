"use client"
import { Button } from '@/components/shadcnUI/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcnUI/dialog'
import { Input } from '@/components/shadcnUI/input'
import { Label } from '@/components/shadcnUI/label'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { ReactNode } from 'react';

interface SharePopoverProps {
    text: string;
    children: ReactNode;
}

export const SharePopover = ({ text, children }: SharePopoverProps) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const input = document.getElementById("link") as HTMLInputElement | null;
        if (!input) return;

        const textToCopy = input.value;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            input.select();
            input.setSelectionRange(0, 99999);
            try {
                const success = document.execCommand("copy");
                if (success) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            } catch (err) {
                console.error(err);
            }
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input id="link" defaultValue={text} readOnly />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="px-3 relative flex items-center justify-center transition-all"
                        onClick={handleCopy}
                    >
                        <span className="sr-only">Copy</span>
                        <span
                            className={`absolute transition-all duration-300 ease-in-out ${copied
                                ? "opacity-0 scale-90"
                                : "opacity-100 scale-110"
                                }`}
                        >
                            <Copy />
                        </span>

                        <span
                            className={`transition-all duration-300 ease-in-out ${copied
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                                }`}
                        >
                            <Check className="text-green-500" />
                        </span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
