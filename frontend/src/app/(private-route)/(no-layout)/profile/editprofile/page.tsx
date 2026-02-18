"use client";
import Image from "next/image";
import { Logo } from "@/components/atomsComponents";
import { EditProfileForm } from "@/components/atomsComponents/editProfileForm";

export default function EditProfile() {
	const handleSave = (data: any) => {
		console.log("Profile data saved:", data);
		// Add your save logic here (API call, etc.)
	};

	const handleCancel = () => {
		console.log("Edit cancelled");
		// Add navigation logic here
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
				<EditProfileForm onSave={handleSave} onCancel={handleCancel} />
			</div>
		</div>
	);
}
