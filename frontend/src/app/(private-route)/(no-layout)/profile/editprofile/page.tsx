"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/api/userApi";
import { Logo } from "@/components/atomsComponents";
import { EditProfileForm } from "@/components/atomsComponents/editProfileForm";
import type { userProfile } from "@/types/user/user-base";

interface ProfileFormData {
    firstName: string;
    lastName: string;
    designation: string;
    handle: string;
    description: string;
    tags: string[];
    socialLinks: Array<{
        id: string;
        platform: string;
        url: string;
        icon: string;
    }>;
    profileImage: string;
}

export default function EditProfile() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileFormData | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getUserProfile();

            // Map backend data to form format
            const socialLinks = data.profile?.social
                ? Object.entries(data.profile.social).map(
                      ([platform, url], index) => ({
                          id: `${platform}-${index}`,
                          platform,
                          url,
                          icon: platform,
                      }),
                  )
                : [];

            const formattedData: ProfileFormData = {
                firstName: data.name.split(" ")[0] || "",
                lastName: data.name.split(" ").slice(1).join(" ") || "",
                designation: data.designation || "",
                handle: data.handle || "",
                description: data.description || "",
                tags: data.profile?.tags || [],
                socialLinks,
                profileImage: data.coverUrl || "https://github.com/shadcn.png",
            };

            setProfileData(formattedData);
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load profile data",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleSave = async (data: ProfileFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            // Map form data to backend format
            const socialObject = data.socialLinks.reduce(
                (acc, link) => {
                    acc[link.platform] = link.url;
                    return acc;
                },
                {} as Record<string, string>,
            );

            const updateData: Partial<userProfile> = {
                name: `${data.firstName} ${data.lastName}`.trim(),
                handle: data.handle,
                description: data.description,
                designation: data.designation,
                coverUrl: data.profileImage,
                userProfile: {
                    tags: data.tags,
                    social: socialObject,
                },
            };

            await updateUserProfile(updateData);

            // Redirect to profile page or show success message
            router.push("/profile");
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(
                err instanceof Error ? err.message : "Failed to save profile",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg.webp"
                    alt="Background pattern"
                    fill
                    className="object-cover opacity-70"
                    priority
                />
            </div>

            {/* Logo */}
            <div className="absolute top-0 left-0 z-20 p-3 md:p-6 w-full">
                <Logo />
            </div>

            {/* Form Container */}
            <div className="w-full max-w-4xl z-10">
                {isLoading && !profileData ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading profile...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-medium">
                            Error loading profile
                        </p>
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                        <button
                            type="button"
                            onClick={fetchUserProfile}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : profileData ? (
                    <EditProfileForm
                        profileData={profileData}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ) : null}
            </div>
        </div>
    );
}
