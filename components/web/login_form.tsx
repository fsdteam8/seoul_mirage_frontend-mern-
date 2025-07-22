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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { DictionaryType } from "@/dictionaries/dictionaries";
import { cn } from "@/lib/utils";

// 1. Zod Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
interface Props {
  dict: DictionaryType;
  locale : "en" | "ar"
}

export default function Login({ dict,locale }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }
      toast.success("Login successful!");
      router.push("/");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Login error:", error);
      toast.error( "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handelLogin = async (provider: string) => {
    if (provider === "google") {
      await signIn("google", { callbackUrl: "/" });
    } else {
      await signIn("facebook", { callbackUrl: "/" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left: Login Form */}
      <div className="flex items-center justify-center bg-white px-6 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[460px] space-y-10"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-normal text-gray-900">
              {dict.login.title}
            </h1>
            <p className="text-gray-600 text-base"> {dict.login.shortTilte}</p>
          </div>

          {/* Form Card */}
          <div className={cn("space-y-4",locale == 'ar' ? 'text-end' : '' )}>
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-normal text-gray-700"
              >
                {dict.login.email}
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-normal text-gray-700"
              >
                {dict.login.password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full h-11 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Checkbox and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  {...register("rememberMe")}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm font-normal text-gray-700 cursor-pointer"
                >
                  {dict.login.RememberMe}
                </Label>
              </div>
              <Link
                href="/reset-password"
                className="text-sm text-gray-900 hover:text-gray-700 font-normal"
              >
                {dict.login.Forgot}
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-black hover:bg-gray-800 text-white font-normal rounded-md transition-colors"
            >
              {isLoading ? dict.login["signing-in"] :dict.login.sgin}
            </Button>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <h2 className="text-center text-sm text-gray-600">{dict.login.continue}</h2>
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
          {/* Footer */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-1 mb-4">
              <span className="text-gray-700 text-sm">
                {dict.login["Don't"]}
              </span>
              <Link href="/sign-up">
                <span className="underline text-sm cursor-pointer">
                  {dict.login["sign-up"]}
                </span>
              </Link>
            </div>

            <p className="text-sm text-gray-600">
              {dict.login["by-signing"]}{" "}
              <Link
                href="#"
                className="text-gray-900 hover:text-gray-700 underline"
              >
                {dict.login.toc}
              </Link>{" "}
              {dict.login.abd}{" "}
              <Link
                href="/privacy-policy"
                className="text-gray-900 hover:text-gray-700 underline"
              >
             {dict.login.poc}
              </Link>
              .
            </p>
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
