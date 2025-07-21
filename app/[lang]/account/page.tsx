"use client";

// import { useState } from "react";
import AccountHeader from "./_components/account-header";
import UserInformation from "./_components/user-information";
// import ShippingAddress from "./_components/shipping-address";
import ChangePassword from "./_components/change-password";
import OrderCard from "./_components/order-card";
import { useTabStore } from "@/store/useTabStore";

export default function AccountPage() {
  const activeTabs = useTabStore((state) => state.activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AccountHeader />

        {activeTabs === "account" && (
          <div className="space-y-[60px]">
            <UserInformation />
            {/* <ShippingAddress /> */}
            <ChangePassword />
            {/* <AccountFooter /> */}
          </div>
        )}

        {activeTabs === "order-history" && (
          <div className="lg:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order History
            </h2>
            <OrderCard />
          </div>
        )}
      </div>
    </div>
  );
}
