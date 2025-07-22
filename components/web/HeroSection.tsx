import { Button } from "@/components/ui/button";
import { DictionaryType } from "@/dictionaries/dictionaries";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  dict: DictionaryType;
  locale: "en" | "ar";
}
export default function HeroSection({ dict, locale }: Props) {
  return (
    <section className="relative min-h-screen w-full  overflow-hidden">
      {/* Background Video */}

      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://videos.pexels.com/video-files/9218226/9218226-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Overlay */}
      <div className="relative z-10   flex min-h-screen items-center ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1
              className={cn(
                "text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[60px]",
                locale == "ar" ? "text-right" : ""
              )}
            >
              {dict.home.banner.title}
            </h1>

            <p
              className={cn(
                "text-lg text-white sm:text-xl md:text-2xl font-semibold mt-[30px] lg:w-[638px]",
                locale == "ar" ? "text-right" : "text-left"
              )}
            >
              {dict.home.banner.desc}
            </p>
            <div className={cn("mt-[60px] flex gap-4 sm:gap-6",locale == "ar" ? "justify-end" : "")}>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-[#000000] text-base hover:bg-white font-semibold px-8 h-[50px] rounded-[32px] sm:text-lg overflow-hidden"
                >
                  {dict.home.banner.shopNowButtonLabel}
                </Button>
              </Link>
              <Link href="/about">
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="lg"
                    className="
                  bg-transparent
                  text-white
                  text-base
                  font-semibold
                  px-8
                  h-[50px]
                  rounded-[32px]
                  sm:text-lg
                  border border-white
                  transition duration-300 ease-in-out
                  group-hover:bg-black group-hover:border-black
                  overflow-hidden
                  relative
                  z-10
                  hover:text-white
                "
                  >
                    <span className="relative z-20">
                      {dict.home.banner.aboutUsButtonLabel}
                    </span>
                  </Button>
                  <div
                    className="
                  absolute inset-0
                  z-0
                  bg-white bg-opacity-0
                  backdrop-blur-md
                  transition duration-300 ease-in-out
                  group-hover:bg-opacity-20 group-hover:backdrop-blur-lg
                  rounded-[32px]
                  pointer-events-none
                "
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
