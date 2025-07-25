import { DictionaryType } from "@/dictionaries/dictionaries";
import { Mail, Phone, MapPin } from "lucide-react";
interface Props {
  dict: DictionaryType;
}
export default function ContactSection({dict}:Props) {

  return (
    <section className="bg-[#F9E4CB] py-12 mb-10 mt-10 ">
      <div className=" container mx-auto !px-10">
        <h2 className="text-2xl flex flex-col justify-center items-center sm:text-[32px] font-medium text-[#000000] mb-10 text-center lg:text-left ">
         {dict.contactus["Reach-Us"].title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Email */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-3">
              <Mail className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">{dict.contactus["Reach-Us"].email}</h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              contact.seoulmirage@gmail.com
            </p>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-3">
              <Phone className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">{dict.contactus["Reach-Us"].phone}</h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              +971 52 2G9 4938
            </p>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">{dict.contactus["Reach-Us"].addressT}</h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
            {dict.contactus["Reach-Us"].address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
