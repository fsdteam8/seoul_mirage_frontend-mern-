import { getDictionary } from "@/dictionaries/dictionaries";
import About_Section from "./_componets/About_Section";

const page = async ({ params }: { params: { lang: string } }) => {
  const { lang } = params;

  const dict = await getDictionary(lang as "en" | "ar");

  return (
    <div>
      <About_Section dict={dict} locale={lang as "en" | "ar"} />
    </div>
  );
};

export default page;
