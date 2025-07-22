import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DictionaryType } from "@/dictionaries/dictionaries";
import { cn } from "@/lib/utils";
import Image from "next/image";
interface Props {
  dict: DictionaryType;
  locale: "en" | "ar"
}
export default function FAQSection({ dict,locale }: Props) {


  return (
    <section className="py-8 md:py-12 lg:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              <div className="aspect-[686/969] w-full">
                <Image
                  src="/asset/contact2.png"
                  alt="Beauty products and cosmetics"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={cn("order-1 lg:order-2",locale == 'ar'? "text-end":"")}>
            <div className="mb-8 md:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000000CC] mb-4">
                {dict.contactus.Questions.title}
              </h2>
              <p className="text-[#000000CC] font-medium text-base sm:text-lg leading-tight">
                {dict.contactus.Questions.desc}
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {dict.contactus.faq.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-[#000000CC] px-2 sm:px-4 w-full"
                >
                  <AccordionTrigger className="text-left text-lg sm:text-xl lg:text-2xl font-medium text-[#000000] hover:no-underline py-4 pr-4">
                    {faq.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#000000] text-base sm:text-lg leading-tight pb-4 pr-4">
                    {faq.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
