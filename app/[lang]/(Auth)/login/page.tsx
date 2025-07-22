import Login from "@/components/web/login_form";
import { getDictionary } from "@/dictionaries/dictionaries";
import React from "react";

const page = async ({ params }: { params: { lang: string } }) => {
    const { lang } = params;
  
    const dict = await getDictionary(lang as "en" | "ar");
  return (
    <div>
      <Login dict={dict} locale={lang as "en" | "ar"}/>
    </div>
  );
};

export default page;
