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
  locale: "en" | "ar";

}

export default function HomePageContainer({ dict,locale }: Props) {
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
              className={`flex-1 min-w-[90px] lg:px-3 lg:py-2 py-2 px-1 text-sm lg:text-md rounded-lg font-medium border text-center transition-all duration-200 ${
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
            <BestSellers dict={dict} />
          </div>
        )}
        {activeTab === "newarrive" && (
          <div>
            <NewArrive dict={dict} />
          </div>
        )}
        {activeTab === "trd" && <div>{<ComingSoon dict={dict} />}</div>}
      </div>

      {/* Static Sections */}
      {/* <NewArrive /> */}
      <div className="mb-32 mt-32">
        <ShopByCategory  dict={dict} />
      </div>

      <OurSkinCare dict={dict} locale={locale} />
      <TestimonialCarousel  dict={dict}/>
    </div>
  );
}
