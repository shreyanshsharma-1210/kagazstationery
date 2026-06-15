import { MessageCircle } from "lucide-react";

const PHONE = "919999999999"; // Replace with real number

export function WhatsAppFab({ message }: { message?: string }) {
  const text = encodeURIComponent(
    message ?? "Hi Kaagaz Stationers! I'd like to place an order from your website."
  );
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground shadow-fab transition-transform hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Order on WhatsApp</span>
    </a>
  );
}
