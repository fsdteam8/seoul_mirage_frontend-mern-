// import HeroSection from "@/components/web/HeroSection";
import { getDictionary } from "@/dictionaries/dictionaries";
import HomePageContainer from "./_components/home-page-container";
import HeroSection from "@/components/web/HeroSection";

const Page = async ({ params }: { params: { lang: string } }) => {
  const { lang } = params;

  const dict = await getDictionary(lang as "en" | "ar");

  return (
    <div>
      {/* Hero Section */}
      <HeroSection dict={dict} locale={lang as "en" | "ar"} />
      <HomePageContainer dict={dict} locale={lang as "en" | "ar"} />
    </div>
  );
  
};

export default Page;
