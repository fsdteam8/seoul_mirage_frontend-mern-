"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DictionaryType } from "@/dictionaries/dictionaries";
import { cn } from "@/lib/utils";
interface Props {
  dict: DictionaryType;
  locale: "en" | "ar"
}

export default function ContactForm({ dict, locale }: Props) {
  const [formDatas, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contacts`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create product");
      }

      return res.json();
    },

    onSuccess: (data) => {
      toast.success(data.message || " Thank you for contacting us!");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", formDatas.name);
    formData.append("email", formDatas.email);
    formData.append("how_can_we_help", formDatas.message);
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formDatas,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-8 sm:py-12 lg:py-0">
      <div className="container mx-auto px-4 mt-10 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Form Section */}
          <div className="order-2 lg:order-1 w-full mb-[20PX]">
            <h2 className={cn("text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[60px] font-bold text-[#000000CC] pb-6 sm:pb-8 lg:pb-10",locale == 'ar' ? "text-end" : "")}>
              {dict.contactus.title}
            </h2>

            <div className="w-full max-w-2xl">
              <div className={cn("mb-6 sm:mb-8", locale == 'ar' ? 'text-end' : '')}>
                <h3 className="text-xl sm:text-2xl font-bold text-[#000000CC] mb-3">
                  {dict.contactus.title1}
                </h3>
                <p className="text-[#000000CC] text-base sm:text-lg font-normal leading-relaxed">
                  {dict.contactus.desc}
                </p>
              </div>

              <form onSubmit={handleSubmit} className={cn("space-y-4 sm:space-y-6", locale == 'ar' ? 'text-end' : '')}>
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-normal text-[#000000] mb-2 block"
                  >
                    {dict.contactus.name}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formDatas.name}
                    onChange={handleChange}
                    className="w-full h-12 sm:h-[60px] border-[#000000] rounded-lg focus:ring-2 focus:ring-gray-200 transition-all"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-normal text-[#000000] mb-2 block"
                  >
                    {dict.contactus.email}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formDatas.email}
                    onChange={handleChange}
                    className="w-full h-12 sm:h-[60px] border-[#000000] rounded-lg focus:ring-2 focus:ring-gray-200 transition-all"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="text-sm font-normal text-[#000000] mb-2 block"
                  >
                    {dict.contactus["How-can-we-help"]}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formDatas.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full min-h-[120px] sm:min-h-[150px] border-[#000000] rounded-lg resize-none focus:ring-2 focus:ring-gray-200 transition-all"
                    required
                  />
                </div>

                <div className="pt-6 sm:pt-8 lg:pt-[60px]">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full sm:w-auto bg-transparent hover:bg-gray-50 text-[#000000CC] px-6 sm:px-8 h-12 sm:h-[51px] rounded-full border border-[#000000CC] transition-all duration-200 hover:shadow-md"
                  >
                    {mutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {dict.contactus.loadingBtn}
                      </div>
                    ) : (
                      dict.contactus.button
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Image Section */}
          <div className="order-1 lg:order-2">
            <div className="relative w-full mx-auto">
              {/* Mobile and Tablet */}
              <div className="aspect-square w-full max-w-md mx-auto lg:hidden">
                <Image
                  src="/asset/contact1.png"
                  alt="Beauty products and cosmetics"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Desktop */}
              <div className="hidden lg:block relative aspect-square w-full max-w-[600px] xl:max-w-[772px] h-auto">
                <Image
                  src="/asset/contact1.png"
                  alt="Beauty products and cosmetics"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
