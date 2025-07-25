"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
// import Image from "next/image";
import { CategorizedData } from "@/types/CategoryDataTypeByNavbar";
import { usePathname } from "next/navigation";
import { DictionaryType } from "@/dictionaries/dictionaries";

// Zod schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// API call
const subscribeToNewsletter = async (formData: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to subscribe. Please try again.");
  }

  return res.json();
};
interface Props {
  lang: string;
  dict: DictionaryType;
}

export default function Footer({ lang, dict }: Props) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: () => {
      toast.success("Subscribed successfully!");
      setEmail("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubscribe = () => {
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      toast.warning(result.error.errors[0].message);
      return;
    }
    const fromdata = new FormData();
    fromdata.append("email", email);
    mutation.mutate(fromdata);
  };

  const { data } = useQuery<CategorizedData>({
    queryKey: ["categoriesData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories-by-type`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const generateHref = (type: string, name: string) =>
    `/${lang}/products?${name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <footer className="bg-gray-50 border-t">
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 ${
          [`/${lang}/login`, `/${lang}/sign-up`].includes(pathname)
            ? "hidden"
            : "block"
        }`}
      >
        <div className="text-center mb-8 md:mb-12 lg:mb-16 mt-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#000000CC] mb-3 md:mb-4">
            {dict.footer["Our-Community"].title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-[18px] text-[#000000CC] mb-8 md:mb-12 lg:mb-[60px] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-[650px] mx-auto font-medium px-4 sm:px-0">
            {dict.footer["Our-Community"].desc}
          </p>

          {/* Email Form */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xs sm:max-w-md md:max-w-lg mx-auto items-stretch sm:items-center px-4 sm:px-0">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="text-[#1E2A38] text-sm sm:text-base flex-1 rounded-full border border-[#00000033] placeholder:text-[#1E2A38] px-[32px] py-[16px]"
            />
            <Button
              onClick={handleSubscribe}
              disabled={mutation.isPending}
              className="bg-[#F092B0] hover:bg-[#F092B0]/90 text-[#000000] text-sm px-[32px] py-[16px] whitespace-nowrap rounded-full"
            >
              {mutation.isPending ?  dict.footer["Our-Community"].button.subscribing : dict.footer["Our-Community"].button.buttonLabel} 
            </Button>
          </div>
        </div>

        {/* ✅ Centered Social Icons */}
        <div className="border-b mb-10 border-[#00000033] mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-4 sm:pt-6">
          <div className="flex space-x-2 justify-center items-center mb-10">
            <Link
              href="#"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-[#F092B0] hover:bg-pink-50 transition-colors shadow-sm"
            >
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="#"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-[#F092B0] hover:bg-pink-50 transition-colors shadow-sm"
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="#"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-[#F092B0] hover:bg-pink-50 transition-colors shadow-sm"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex justify-center gap-6 sm:gap-8 lg:gap-[350px]">
          {/* Shop Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#000000CC] mb-3 md:mb-4">
              {dict.footer.link.shop.title}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.shop.allproduct}
                </Link>
              </li>
              <li>
                <Link
                  href="/#best"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.shop.Bestsellers}
                </Link>
              </li>
              <li>
                <Link
                  href="/#new"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.shop.NewArrivals}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#000000CC] mb-3 md:mb-4">
              {dict.footer.link.about.title}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.about.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.about.contact}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq-&-help"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.about.shipping}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq-&-help"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.about.faq}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                >
                  {dict.footer.link.about.poc}
                </Link>
              </li>
            </ul>
          </div>

          {/* Skincare Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-medium text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#000000CC] mb-3 md:mb-4">
              {dict.home.navbar.skincare}
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {data?.Skincare?.slice(0, 5).map((item) => (
                <li key={item.id} >
                  <Link
                    href={generateHref("category", item.name)}
                    className="text-sm sm:text-base lg:text-base text-[#000000CC] font-normal hover:text-[#F092B0] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#00000033] mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-4 sm:pt-6">
          <p className="text-xs sm:text-sm text-[#000000CC] font-medium text-center">
            © 2025, Seoul Mirage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
