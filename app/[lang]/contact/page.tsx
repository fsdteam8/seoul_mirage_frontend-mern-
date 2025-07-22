import React from 'react'
import ContactForm from './_component/ContactFrom'
import ContactInfo from './_component/ContactInfro'
import FAQSection from './_component/FAQSection'
import { getDictionary } from '@/dictionaries/dictionaries'

const page = async ({ params }: { params: { lang: string } }) => {
   const { lang } = params;
  
    const dict = await getDictionary(lang as "en" | "ar");
    
  return (
    <div>
      <ContactForm dict={dict} locale={lang as "en" | "ar"} />
      <ContactInfo dict={dict}/>
      <FAQSection dict={dict} locale={lang as "en" | "ar"}/>
    </div>
  )
}

export default page
