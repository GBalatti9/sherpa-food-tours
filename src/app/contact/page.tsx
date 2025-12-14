
import { FormContact } from "@/ui/components/form-contact";

export default async function ContactPage() {

  return (
    <main className="contact-page" style={{ minHeight: "80vh" }}>
      <section className="contact-section">
        <h2>Got any questions? <span>Contact Us!</span></h2>
        <FormContact />
      </section>
    </main>
  );
};