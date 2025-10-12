import { wp } from "@/lib/wp";
import FormContact from "./client-side";


export default async function ContactPage(){
    const data = await wp.getPageInfo("contact");
    
  return (
    <main className="contact-page">
        <FormContact data={data.content as string}/>
    </main>
  );
};