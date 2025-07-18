"use client";

// import logo from "../../../public/logo.optimized.svg";

import SearchDialog from "@/components/search-dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DictionaryType } from "@/dictionaries/dictionaries";
import { useCartStore } from "@/store/cart-store";
import { useTabStore } from "@/store/useTabStore";
import type { CategorizedData } from "@/types/CategoryDataTypeByNavbar";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Menu, Search, ShoppingBag, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  lang: string;
  dict: DictionaryType;
}

export default function Navbar({ lang, dict }: Props) {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token || "";
  const { items } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSkincareOpen, setIsSkincareOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const setActiveTab = useTabStore((state) => state.setActiveTab);

  const { data, isLoading } = useQuery<CategorizedData>({
    queryKey: ["categoriesData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/by-type`,
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
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-6 lg:py-12 lg:py12 justify-between lg:h-16 h-32">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex  items-center  ">
              {/* <Image
                src={"/logo.optimized.svg"}
                alt="Serendipity"
                width={0} // Let it be responsive
                height={0}
                className="w-[140px] hidden h-[100px] md:w-[140px] md:h-[140px]"
                priority // optional: helps load faster if this is a crucial image
              /> */}
              <Image
                src="/logo.high-quality.svg"
                width={900}
                height={900}
                quality={90}
                alt="Sara & Paige Collections"
                className="w-[145px] h-[300px] md:w-[140px] md:h-[140px]"
                style={{ imageRendering: "auto" }}
              />
            </Link>
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="space-x-6">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="nav-text">
                    {dict.home.navbar.skincare}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-4 p-4 w-[400px]">
                      {isLoading ? (
                        <div>Loading...</div>
                      ) : (
                        data?.Skincare?.map((item) => (
                          <NavigationMenuLink key={item.id} asChild>
                            <Link
                              href={generateHref("category", item.name)}
                              className="block rounded-md p-2 text-sm hover:bg-gray-50"
                            >
                              {item.name}
                            </Link>
                          </NavigationMenuLink>
                        ))
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="nav-text">
                    {dict.home.navbar.collections}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-4 p-4 w-[400px]">
                      {isLoading ? (
                        <div>Loading...</div>
                      ) : (
                        data?.Collections?.map((item) => (
                          <NavigationMenuLink key={item.id} asChild>
                            <Link
                              href={generateHref("collections", item.name)}
                              className="block rounded-md p-2 text-sm hover:bg-gray-50"
                            >
                              {item.name}
                            </Link>
                          </NavigationMenuLink>
                        ))
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" className="nav-text">
                    {dict.home.navbar.about}
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact" className="nav-text">
                    {dict.home.navbar.contact}
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side: Icons */}
          <div className="flex items-center space-x-5">
            {/* Search icon (always visible) */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsSearchDialogOpen(true)}
            >
              <Search className="h-10 w-10" />
            </Button>

            {/* Cart icon (always visible) */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ">
                <ShoppingBag className="h-4 w-4 " />
              </Button>
              {items.length === 0 ? (
                ""
              ) : (
                <span className="absolute left-4 -top-1 bg-red-500 py-1 px-2 text-[8px] rounded-full text-white">
                  {items.length}
                </span>
              )}
            </Link>

            {token || session.status === "authenticated" ? (
              // Logged-in user: show user dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/account" onClick={() => setActiveTab("account")} className="w-full font-raleway">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account" onClick={() => setActiveTab("order-history")} className="w-full font-raleway">
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 font-raleway"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Guest user: show login link
              <Link
                href="/login"
                className="font-raleway bg-[#F092B0] text-white   px-3 py-1 rounded-lg font-medium text-sm hover:underline"
              >
                {dict.home.navbar.login}
              </Link>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] sm:w-[350px] p-0"
                >
                  <SheetHeader className="p-6 pb-4 border-b">
                    <SheetTitle className="text-left font-raleway">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col p-6 space-y-1">
                    {/* Mobile Skincare */}
                    <Collapsible
                      open={isSkincareOpen}
                      onOpenChange={setIsSkincareOpen}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-3 text-lg font-medium text-black hover:bg-gray-50 rounded-md">
                        {dict.home.navbar.skincare}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isSkincareOpen ? "rotate-180" : ""
                            }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1 space-y-1">
                        {data?.Skincare?.map((item) => (
                          <Link
                            key={item.id}
                            href={generateHref("skincare", item.name)}
                            className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Mobile Collections */}
                    <Collapsible
                      open={isCollectionsOpen}
                      onOpenChange={setIsCollectionsOpen}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-3 text-lg font-medium text-black hover:bg-gray-50 rounded-md">
                        {dict.home.navbar.collections}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isCollectionsOpen ? "rotate-180" : ""
                            }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1 space-y-1">
                        {data?.Collections?.map((item) => (
                          <Link
                            key={item.id}
                            href={generateHref("collections", item.name)}
                            className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    <Link
                      href="/about"
                      className="py-3 px-3 text-lg font-medium hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dict.home.navbar.about}
                    </Link>
                    <Link
                      href="/contact"
                      className="py-3 px-3 text-lg font-medium hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dict.home.navbar.contact}
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search Dialog */}
        <SearchDialog
          open={isSearchDialogOpen}
          onOpenChange={setIsSearchDialogOpen}
        />
      </div>
    </header>
  );
}
