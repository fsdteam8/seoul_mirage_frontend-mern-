"use client";

import { useState } from "react";

// ✅ Import your components (double-check these paths)
// import BestSellers from "@/components/BestSellers"; // ✅ FIXED typo from BestSerllers
import BestSellers from "@/components/BestSerllers";
import ComingSoon from "@/components/coming-soon";
import NewArrive from "@/components/NewArrive";
import OurSkinCare from "@/components/OurSkinCare";
import ShopByCategory from "@/components/Product/ShopByCategory";
import TestimonialCarousel from "@/components/web/Testimonial";
import { DictionaryType } from "@/dictionaries/dictionaries";

const tabs = [
  { id: "bestsellers", label: "Best Sellers" },
  { id: "newarrive", label: "New Arrivals" },
  { id: "trd", label: "Coming soon" },
];

interface Props {
  dict: DictionaryType;
}

export default function HomePageContainer({ dict }: Props) {
  const [activeTab, setActiveTab] = useState("bestsellers");

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex justify-center mt-10 px-4">
        <div className="flex w-full max-w-md justify-between flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[90px] px-5 py-2 rounded-lg font-medium border text-center transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#F092B0] text-white"
                  : "bg-white text-black border-[#F092B0] hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8 px-4">
        {activeTab === "bestsellers" && (
          <div>
            <BestSellers />
          </div>
        )}
        {activeTab === "newarrive" && (
          <div>
            <NewArrive />
          </div>
        )}
        {activeTab === "trd" && <div>{<ComingSoon />}</div>}
      </div>

      {/* Static Sections */}
      {/* <NewArrive /> */}
      <ShopByCategory />

      <OurSkinCare dict={dict} />
      <TestimonialCarousel />
    </div>
  );
}
