import AllProduct from "@/components/Product/AllProduct";
import { getDictionary } from "@/dictionaries/dictionaries";
import { Suspense } from "react";

export default async function HomePage({ params }: { params: { lang: string } }) {
  const { lang } = params;

  const dict = await getDictionary(lang as "en" | "ar");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <Suspense >
          <AllProduct dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}
