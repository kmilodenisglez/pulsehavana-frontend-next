import { Icon } from "./Icon";

const WHATSAPP_NUMBER = "+5359352209";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

export function WhatsAppFab() {
  return (
    <aside className="fixed bottom-20 right-4 z-40">
      <a
        aria-label="Contactar soporte vía WhatsApp"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 h-12 px-4 rounded-full bg-primary-container text-on-primary shadow-lg shadow-primary-container/20 active:scale-[0.95] transition-all duration-150 backdrop-blur-md"
      >
        <Icon name="chat" className="text-[20px]" />
        <span className="font-callout-button text-[14px] font-semibold pr-0.5">WhatsApp</span>
      </a>
    </aside>
  );
}
