import SignUp from "@/components/web/sgin-up-form";
import { getDictionary } from "@/dictionaries/dictionaries";
import React from "react";

const page = async ({ params }: { params: { lang: string } }) => {
  const { lang } = params;

  const dict = await getDictionary(lang as "en" | "ar");

  return (
    <div>
      <SignUp dict={dict} locale={lang as "en" | "ar"}/>
    </div>
  );
};

export default page;
