"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { DictionaryType } from "@/dictionaries/dictionaries";
import { cn } from "@/lib/utils";

// Zod Schema
const loginSchema = z
  .object({
    name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;

interface Props {
  dict: DictionaryType
  locale : "en" | "ar"
}


export default function SignUp({ dict,locale }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const handelLogin = async (provider: string) => {
    if (provider === "google") {
      await signIn("google", { callbackUrl: "/" });
    } else {
      await signIn("facebook", { callbackUrl: "/" });
    }
  };
  const mutation = useMutation({

    mutationFn: async (data: LoginFormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registration failed");
      }

      return result;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Registration successful!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred during registration");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div
        className="min-h-screen flex items-center justify-center px-4 py-8"
        style={{ backgroundColor: "white" }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn("w-full max-w-md space-y-9", locale == "ar" ? "text-end" : "")}
        >
          {/* Social Login Buttons */}
          <div className="space-y-4">
            <h2 className=" text-md font-bold text-gray-600">{dict.signup.topTitle}</h2>
            <div className="flex gap-5">
              {/* Google */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handelLogin("google")}
                className="w-full flex items-center justify-center gap-2 text-sm border-gray-300"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Google
              </Button>

              {/* Facebook */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handelLogin("facebook")}
                className="w-full flex bg-[#3b5998] text-white items-center justify-center gap-2 text-sm border-gray-300"
              >
                <Image
                  src="/facebook.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
                Facebook
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-normal text-gray-900">
              {dict.signup.title}
            </h1>
            {/* <p className="text-gray-600 text-base">
              Or sign in to your existing account
            </p> */}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg py-0 space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-normal text-gray-700"
                >
                  {dict.signup.fullname}
                </Label>
                <Input id="name" type="text" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-normal text-gray-700"
                >
                  {dict.signup.email}
                </Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-normal text-gray-700"
                >
                  {dict.signup.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-normal text-gray-700"
                >
                  {dict.signup["confirm-password"]}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-center  justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" {...register("rememberMe")} />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm font-normal text-gray-700 cursor-pointer"
                  >
                    {dict.signup.tmc}
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 bg-black hover:bg-gray-800 text-white"
              >
                {dict.signup.sginup}
              </Button>
            </div>
          </div>
          {/* Google Sign-In Button
        <Button
          type="button"
          variant="outline"
          onClick={() => handelLogin("google")}
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm border-gray-300"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Sign up with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handelLogin("facebook")}
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm border-gray-300"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Sign up with Facebook
        </Button> */}

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            {dict.signup.hvand}{" "}
            <Link
              href="/login"
              className="text-gray-900 hover:text-gray-700 underline"
            >
              {dict.signup.sgin}
            </Link>
          </div>
        </form>
      </div>
      {/* Right: Image Section */}
      <div className="h-full w-full hidden md:block">
        <Image
          src="/hero.jpg"
          alt="Hero"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
