import Link from "next/link";
import Image from "next/image";
import type { InterventionType } from "@/types";
import { serviceList } from "@/lib/services";

interface ServiceCardProps {
  service: InterventionType;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const item = serviceList[service];
  if (!item) return null;
  return (
    <Link href={`/services/${service}`} className="service-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ position: "relative", width: "100%", height: "220px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} />
      </div>
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1, gap: "0.75rem" }}>
        <h3 className="service-card__title">{item.title}</h3>
        <p className="service-card__desc">{item.description}</p>
        <span className="service-card__cta">En savoir plus →</span>
      </div>
    </Link>
  );
}
