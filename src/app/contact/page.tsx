import { wp } from "@/lib/wp";
import { FormContact } from "@/ui/components/form-contact";
// import "./contact.css";



export default async function ContactPage() {
  const data = await wp.getPageInfo("contact");

  return (
    <main className="contact-page" style={{ minHeight: "80vh" }}>
      <section className="contact-section">
        <h2>Got any questions? <span>Contact Us!</span></h2>
        <FormContact />
      </section>
    </main>
  );
};