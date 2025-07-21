"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Zod validation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  image: z
    .any()
    .refine(
      (file) =>
        file instanceof File || file === null || typeof file === "string",
      { message: "Invalid image file" }
    ),
});

type UserFormValues = z.infer<typeof userSchema>;

// ✅ Skeleton for loading
function UserInformationSkeleton() {
  return (
    <div className="rounded-lg p-6 mb-6">
      <Skeleton className="h-6 w-40 mb-6" />

      <div className="flex mb-[30px]">
        <Skeleton className="w-[200px] h-[200px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-40" />
    </div>
  );
}

export default function UserInformation() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token || "";
  

  const {
    data: meData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mee"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  const user = meData?.data;

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/change-profile-details`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Profile update failed");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      phone: "",
      image: null,
    },
  });

  // Set form values when user data is fetched
  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("phone", user.phone || "");
      setValue("image", user.image || null);

      if (user.image && typeof user.image === "string") {
        setPreviewImage(`${user.image}`);
      }
    }
  }, [user, setValue]);

  const image = watch("image");

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const onSubmit = (data: UserFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("image", data.image);
    mutation.mutate(formData);
  };

  if (isLoading) return <UserInformationSkeleton />;
  if (isError)
    return <p className="p-4 text-red-500">Failed to load user info</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        User Information
      </h2>

      {/* Profile Image Upload */}
      <div className="flex mb-[30px]">
        <label htmlFor="image">
          <Avatar className="w-[200px] h-[200px] border border-gray-200 cursor-pointer">
            <AvatarImage
              src={previewImage || "/placeholder.svg?height=80&width=80"}
              alt="Profile"
            />
            <AvatarFallback className="text-lg">U</AvatarFallback>
          </Avatar>
        </label>
        <input
          type="file"
          id="image"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setValue("image", file);
              setPreviewImage(null);
            }
          }}
        />
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email ?? ""} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Update...
          </>
        ) : (
          "Update Profile"
        )}
      </Button>
    </form>
  );
}
