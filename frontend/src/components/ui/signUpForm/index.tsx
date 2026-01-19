"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/shadcnUI/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcnUI/form";
import { Input } from "@/components/shadcnUI/input";
import { Card, CardContent } from "@/components/shadcnUI/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { useState, useRef, useLayoutEffect, useState as useStateAlias } from "react";
import ReactDOM from "react-dom";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/shadcnUI/input-otp";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/shadcnUI/label";
import { Plus, X } from "lucide-react";


const emailSchema = z.object({
    email: z.string().email("Please enter a valid email"),
});

const passwordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/\d/, "Must include a number")
        .regex(/[^a-zA-Z0-9]/, "Must include a special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const profileSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    dob: z.string()
        .refine((val) => {
            // Must be a valid date string (yyyy-mm-dd)
            const date = new Date(val);
            if (isNaN(date.getTime())) return false;
            const today = new Date();
            let age = today.getFullYear() - date.getFullYear();
            const m = today.getMonth() - date.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                age--;
            }
            return age >= 13 && age < 120;
        }, { message: "Must be at least 13 years old and less than 120" }),
    designation: z.string().min(2, "Designation is required"),
});




export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();

    const [stage, setStage] = useState<
        "email" | "verify" | "password" | "profile" | "complete"
    >("email");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [designation, setDesignation] = useState("");
    const tagInputRef = useRef<HTMLInputElement>(null);
    const [dropdownPos, setDropdownPos] = useState<{ left: number, top: number, width: number }>({ left: 0, top: 0, width: 320 });

    useLayoutEffect(() => {
        if (showTagSuggestions && tagInputRef.current) {
            const rect = tagInputRef.current.getBoundingClientRect();
            setDropdownPos({
                left: rect.left,
                top: rect.bottom + window.scrollY,
                width: rect.width
            });
        }
    }, [showTagSuggestions, tagInput]);

    const predefinedTags = [
        "Developer",
        "Designer",
        "Writer",
        "Photographer",
        "Creator",
        "Artist",
        "Engineer",
        "Entrepreneur",
        "Student",
        "Teacher",
        "Manager",
        "Freelancer",
    ];

    // Filter predefined tags based on input and exclude already selected tags
    const filteredTags = predefinedTags.filter(
        (tag) =>
            tag.toLowerCase().includes(tagInput.toLowerCase()) &&
            !tags.includes(tag)
    );

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
            setShowTagSuggestions(false);
        } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        } else if (e.key === "Escape") {
            setShowTagSuggestions(false);
        } else if (
            e.key === "ArrowDown" &&
            showTagSuggestions &&
            filteredTags.length > 0
        ) {
            e.preventDefault();
            // Focus first suggestion
        }
    };

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: "", lastName: "", dob: "", designation: "" },
    });


    const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
        setEmail(values.email);
        setStage("verify");
    };

    const onVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Enter the 6-digit verification code");
            return;
        }
        setStage("password");
    };

    const onPasswordSubmit = () => {
        setStage("profile");
    };

    const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
        const payload = {
            email,
            password: passwordForm.getValues("password"),
            firstName: values.firstName,
            lastName: values.lastName,
            dob: values.dob,
            designation: values.designation,
            tags,
        };
        console.log(payload);

        toast.success(`Account created for ${values.firstName}`);
        setStage("complete");

        setTimeout(() => router.push("/"), 1500);
    };


    return (
        <div className={cn("flex flex-col gap-6 justify-center items-center ", className)} {...props}>
            <Card className="overflow-hidden p-0 w-full justify-center flex items-center">
                <CardContent className="p-0 w-full grid md:grid-cols-2">
                    <div className="space-y-8 p-6 md:p-10 py-8 md:py-12 ">

                        {/* EMAIL */}
                        {stage === "email" && (
                            <>
                                <Form {...emailForm}>
                                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                                        <div className="flex flex-col items-center text-center">
                                            <h1 className="text-2xl font-bold">
                                                Create your account
                                            </h1>
                                            <p className="text-balance text-muted-foreground">
                                                Sign up to Bamboo account
                                            </p>
                                        </div>

                                        <FormField
                                            control={emailForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button className="w-full">Sign up</Button>
                                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                            <span className="relative z-10 bg-card px-2 text-muted-foreground">
                                                Or continue with
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() =>
                                                router.push(
                                                    `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/auth/login/google`
                                                )
                                            }
                                        >
                                            <FcGoogle />
                                            <span className="ml-2">Continue with Google</span>
                                        </Button>

                                    </form>
                                </Form>
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="underline underline-offset-4"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* VERIFY */}
                        {stage === "verify" && (
                            <form onSubmit={onVerifySubmit} className="space-y-6 text-center">
                                <h1 className="text-2xl font-bold">Verify Email</h1>
                                <p className="text-muted-foreground">{email}</p>

                                <div className="flex justify-center w-full">
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup>
                                            {[...Array(6)].map((_, i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <Button className="w-full">Verify</Button>
                                <Button variant="ghost" className="w-full" onClick={() => setStage("email")}>
                                    Back
                                </Button>
                            </form>
                        )}

                        {/* PASSWORD */}
                        {stage === "password" && (
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                    <h1 className="text-2xl font-bold text-center">Set Password</h1>

                                    <FormField
                                        control={passwordForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} autoComplete="new-password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} autoComplete="new-password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button className="w-full">Continue</Button>
                                </form>
                            </Form>
                        )}

                        {/* PROFILE */}
                        {stage === "profile" && (
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                    <h1 className="text-2xl font-bold text-center">Your Info</h1>

                                    <FormField
                                        control={profileForm.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={profileForm.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={profileForm.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date of Birth</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="designation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Designation <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="designation"
                                                        {...field}
                                                        className="h-11"
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid flex-1 gap-3">
                                        <Label htmlFor="tags" className="text-sm font-medium">
                                            Tags <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <div className="flex items-center gap-2 min-h-[44px] p-2 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                    {tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-foreground text-background rounded-md text-sm font-medium"
                                                        >
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag(tag)}
                                                                className="hover:bg-primary/20 rounded-sm transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        id="tags"
                                                        ref={tagInputRef}
                                                        value={tagInput}
                                                        onChange={(e) => {
                                                            setTagInput(e.target.value);
                                                            setShowTagSuggestions(true);
                                                        }}
                                                        onFocus={() => setShowTagSuggestions(true)}
                                                        onBlur={() =>
                                                            setTimeout(() => setShowTagSuggestions(false), 200)
                                                        }
                                                        onKeyDown={handleTagInputKeyDown}
                                                        placeholder={
                                                            tags.length === 0 ? "Type to search or add tags..." : ""
                                                        }
                                                        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Autocomplete Dropdown */}
                                            {showTagSuggestions && filteredTags.length > 0 &&
                                                typeof window !== "undefined" && ReactDOM.createPortal(
                                                    <div
                                                        className="bg-background border rounded-lg shadow-lg max-h-[200px] overflow-y-auto custom-scroll"
                                                        style={{
                                                            position: "absolute",
                                                            zIndex: 9999,
                                                            left: dropdownPos.left,
                                                            top: dropdownPos.top + 20,
                                                            width: dropdownPos.width,
                                                            pointerEvents: "auto"
                                                        }}
                                                    >
                                                        {filteredTags.map((tag) => (
                                                            <button
                                                                key={tag}
                                                                type="button"
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    addTag(tag);
                                                                    setShowTagSuggestions(false);
                                                                }}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                                            >
                                                                <Plus className="h-3 w-3 text-muted-foreground" />
                                                                {tag}
                                                            </button>
                                                        ))}
                                                    </div>,
                                                    document.body
                                                )
                                            }
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            Press Enter or comma to add. Start typing for suggestions.
                                        </span>
                                    </div>


                                    <Button className="w-full">Complete Signup</Button>
                                </form>
                            </Form>
                        )}

                        {/* COMPLETE */}
                        {stage === "complete" && (
                            <div className="text-center space-y-4">
                                <h1 className="text-2xl font-bold">Account Created</h1>
                                <p>Redirecting...</p>
                            </div>
                        )}
                    </div>

                    <div className="relative hidden md:block">
                        <Image
                            fill
                            src="https://modii.org/wp-content/uploads/2020/12/random.png"
                            alt=""
                            className="object-cover dark:brightness-75"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
