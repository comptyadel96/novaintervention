import Link from "next/link";
import type { InterventionType } from "@/lib/types";
import { serviceList } from "@/lib/services";

interface ServiceCardProps {
  service: InterventionType;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const item = serviceList[service];
  return (
    <Link href={`/services/${service}`} className="service-card">
      <div className="service-card__icon">{item.icon}</div>
      <h3 className="service-card__title">{item.title}</h3>
      <p className="service-card__desc">{item.description}</p>
      <span className="service-card__cta">En savoir plus →</span>
    </Link>
  );
}
