"use client";

import { Button } from "@/components/ui/button";
import { useTabStore } from "@/store/useTabStore";

export default function AccountHeader() {
  const activeTab = useTabStore((state) => state.activeTab ?? "account"); // fallback to "account"
  const setActiveTab = useTabStore((state) => state.setActiveTab);

  return (
    <div className="mb-5">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Account</h1>
      <div className="flex gap-3">
        <Button
          variant={activeTab === "account" ? "default" : "outline"}
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === "account"
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Profile
        </Button>

        <Button
          variant={activeTab === "order-history" ? "default" : "outline"}
          onClick={() => setActiveTab("order-history")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === "order-history"
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Order History
        </Button>
      </div>
    </div>
  );
}
