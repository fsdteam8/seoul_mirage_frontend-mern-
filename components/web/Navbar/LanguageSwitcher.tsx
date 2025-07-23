"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Define available locales
const locales = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState("en");

  //  const langREloade =  () => {

  // }

  // Extract current locale from pathname
  useEffect(() => {
    const localeFromPath = pathname.split("/")[1];
    if (locales.some((locale) => locale.value === localeFromPath)) {
      setCurrentLocale(localeFromPath);
    }
  }, [pathname]);

  // Handle language change
  const handleLanguageChange = (newLocale: string) => {
    // Update URL with new locale
    const newPath = pathname.replace(/^\/[^\/]+/, `/${newLocale}`);
    // Set cookie to persist locale preference
    document.cookie = `preferredLocale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365
      }`;
    // router.push(newPath);
    // Force full page reload
    window.location.href = newPath;
  };

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="rounded-md border border-gray-300 px-3 w-20 py-1 focus:ring-2 focus:ring-blue-500">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale.value} value={locale.value}>
            {locale.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
