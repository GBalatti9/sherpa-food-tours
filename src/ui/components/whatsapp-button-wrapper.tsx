import { wp } from "@/lib/wp";
import WhatsAppFloatingButton from "./whatsapp-button";

export default async function WhatsAppButtonWrapper() {
  const footerData = await wp.getEmbedSectionInfo("footer");
  const whatsapp: string | undefined = footerData?.acf?.whatsapp;

  if (!whatsapp || whatsapp.trim().length === 0) return null;

  return <WhatsAppFloatingButton whatsapp={whatsapp.trim()} />;
}
