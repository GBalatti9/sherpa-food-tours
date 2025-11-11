import { FormContact } from "@/ui/components/form-contact";
// import "../contact/contact.css";


export default async function ContactPage() {

  return (
    <main className="contact-page">
      <section className="contact-section">
        <h2>Got any questions? <span>Contact Us!</span></h2>
        <FormContact />
      </section>
    </main>
  );
};